"use client";


import {
  Box,
  Button,
  Typography,
  CardContent,
} from "@mui/material";
import {
  Stack, Divider, useTheme, Paper
} from "@mui/material"
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";


type Step = {
  Id: number;
  D1: number;
  D2: number;
  Sum: number;
  Hint: string;
  Side: "left" | "right";
  CarryIn?: number;
  CarryOut?: number;
  ParentHint?: string;
};

type DivisionData = {
  Numbers: readonly number[];
  Steps: readonly Step[];
  correctAnswer: number;
};

type DivisionProps = {
  data: DivisionData;
};

export default function DivisionVisualizer({ data }: DivisionProps) {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = data.Steps;
  const step = steps[currentStep];

  const dividend = data.Numbers[0];
  const divisor = data.Numbers[1];

  const quotientDigits = useMemo(() => {
    return steps
      .filter((s) => s.Side === "right")
      .map((s) => String(s.Sum));
  }, [steps]);

  const revealedQuotient = useMemo(() => {
    const count = steps.filter((s) => s.Side === "right" && s.Id <= step.Id).length;
    return quotientDigits.slice(0, count);
  }, [steps, quotientDigits, step.Id]);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const reset = () => setCurrentStep(0);

  const isSubtractionStep = (step: Step) => step.Hint?.toLowerCase().includes("вычт");
  const isBringDownStep = (step: Step) => step.Hint?.toLowerCase().includes("спусти");

  return (
    <Paper
      elevation={2}
      sx={{
        width: 600,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        background: 'linear-gradient(90deg, #f8f9fa 0.5px, transparent 0.5px) 0 0 / 20px 100%, linear-gradient(0deg, #e9ecef 0.5px, transparent 0.5px) 0 0 / 100% 24px',
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ color: theme.palette.primary.main, mb: 4 }}
        >
          Раздели в столбик
        </Typography>

        <Stack direction={'row'} sx={{ width: 1, position: 'relative' }}>
          <Box sx={{ width: "60%", pb: 1, pr: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: 'right',
                fontSize: '1.8rem',
                letterSpacing: 2,
              }}
            >
              {dividend}
            </Typography>

            <Box sx={{ mt: 3, minHeight: 120 }}>
              {steps.slice(0, currentStep + 1).map((s, index) => {
                if (s.Side !== "left") return null;

                const active = s.Id === step.Id;
                const isBringDown = isBringDownStep(s);

                return (
                  <motion.div
                    key={s.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: 'flex-end',
                        gap: 2,
                        mb: 1.5,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: active ? theme.palette.action.hover : 'transparent',
                      }}
                    >
                      {isBringDown ? (
                        <>
                          <motion.span
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 700,
                                color: theme.palette.info.main,
                              }}
                            >
                              {s.Sum}
                            </Typography>
                          </motion.span>
                        </>
                      ) : isSubtractionStep(s) ? (
                        <>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 0.5,
                            minWidth: 80
                          }}>
                            <Box sx={{
                              width: '100%',
                              textAlign: 'right',
                              pr: 1
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                {s.D1}
                              </Typography>
                            </Box>

                            <Box sx={{
                              width: '100%',
                              borderBottom: '1px solid',
                              borderColor: theme.palette.text.primary,
                              position: 'relative',
                              textAlign: 'right'
                            }}>
                              <Typography variant="body1" sx={{
                                fontWeight: 700,
                                fontFamily: 'monospace',
                                position: 'relative',
                                top: 2,
                                pr: 1
                              }}>
                                -{s.D2}
                              </Typography>
                            </Box>

                            <Box sx={{
                              width: '100%',
                              textAlign: 'right',
                              pr: 1
                            }}>
                              <Typography variant="body1" sx={{
                                fontWeight: 700,
                                color: theme.palette.success.main,
                                fontFamily: 'monospace'
                              }}>
                                {s.Sum}
                              </Typography>
                            </Box>
                          </Box>
                          {s?.CarryOut && s.CarryOut > 0 && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontStyle: 'italic',
                              }}
                            >
                              (остаток: {s.CarryOut})
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: active ? theme.palette.primary.main : theme.palette.text.primary,
                          }}
                        >
                          {s.D1} × {s.D2} = {s.Sum}
                        </Typography>
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>

          <Box sx={{
            width: "40%",
            borderLeft: '2px solid black',
            display: 'flex',
            flexDirection: "column",
            position: 'relative',
          }}>
            <Box sx={{
              pl: 2,
              borderBottom: '2px solid black',
              minHeight: 50,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.8rem'
                }}
              >
                {divisor}
              </Typography>
            </Box>

            <Box sx={{
              pl: 2,
              minHeight: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 'auto'
            }}>
              <Box sx={{
                display: 'flex',
                gap: 2,
              }}>
                {Array.from({ length: quotientDigits.length }).map((_, i) => {
                  const digit = revealedQuotient[i];
                  return (
                    <Box
                      key={i}
                      sx={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 700,
                        color: digit ? theme.palette.success.main : 'transparent',
                      }}
                    >
                      {digit || "0"}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box sx={{ position: 'relative', width: '100%' }}>
          {steps.slice(0, currentStep + 1).map((s, index) => {
            if (s.Side !== "right") return null;

            const active = s.Id === step.Id;
            if (!active) return null;

            return (
              <motion.div
                key={s.Id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: active ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: `${20 + index * 15}%`,
                  right: '10%',
                  zIndex: active ? 1000 : 1,
                }}
              >
                <Paper
                  elevation={active ? 8 : 2}
                  sx={{
                    p: 2,
                    backgroundColor: active ? theme.palette.primary.light : theme.palette.grey[100],
                    border: active ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    borderRadius: 2,
                    minWidth: 150,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: active ? 'white' : theme.palette.primary.main,
                    }}
                  >
                    {s.D1} ÷ {s.D2} = {s.Sum}
                  </Typography>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          fontStyle: 'italic',
                        }}
                      >
                        Результат деления
                      </Typography>
                    </motion.div>
                  )}
                </Paper>
              </motion.div>
            );
          })}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={reset}
                size="medium"
                disabled={currentStep === 0}
              >
                ↶
              </Button>
              <Button
                variant="outlined"
                onClick={prevStep}
                disabled={currentStep === 0}
                size="medium"
              >
                ←
              </Button>
              <Button
                variant="contained"
                onClick={nextStep}
                disabled={currentStep >= steps.length - 1}
                size="medium"
              >
                →
              </Button>
            </Stack>


          </Stack>

        </Box>
      </CardContent>
    </Paper>
  );
}