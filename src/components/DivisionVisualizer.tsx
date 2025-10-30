"use client";

import {
  Box,
  Stack,
  Paper,
  Divider,
  Typography,
  CardContent,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function DivisionVisualizer({ data }: Record<string, any>) {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [initialDivisor, setInitialDivisor] = useState<number>(0);
  const [initialDividend, setInitialDividend] = useState<number>(0);
  const [rightSideState, setRightSideState] = useState<string>("");
  const [leftInputFieldState, setLeftInputFieldState] = useState("");
  const [rightInputFieldState, setRightInputFieldState] = useState("");
  const [showRightSideTooltip, setShowRightSideTooltip] = useState(false);
  const [showLeftSideTooltip, setShowLeftSideTooltip] = useState(false);
  const [leftSideStack, setLeftSideStack] = useState<Record<string, any>[]>([])
  const [leftSideStackItem, setLeftSideStackItem] = useState<Record<string, any>>({})

  const [steps, setSteps] = useState<Record<string, any>[] | null>(null)

  useEffect(() => {
    if (data) {
      setInitialDividend(data.question.Numbers[0])
      setInitialDivisor(data.question.Numbers[1])
      setSteps(data.question.Steps)
    }
  }, [data])

  useEffect(() => {
    console.log(leftSideStackItem)
    if (leftSideStackItem.coef >= 0 && leftSideStackItem.remainder >= 0) {
      setLeftSideStack((prev) => [...prev, leftSideStackItem]);
      setLeftSideStackItem({});
    }

  }, [leftSideStackItem])

  useEffect(() => {
    console.log(leftSideStack)
  }, [leftSideStack])

  const sumCharCount = steps ? `${steps[currentStep]?.Sum}`.length : 1;

  const LeftSideStateVisualize = () => {
    const LEVEL_INDENT_SIZE = 4;

    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
        mr: 2
      }}>
        {leftSideStack.map((stepData, index) => {

          const maxLength = Math.max(
            String(stepData.coef).length,
            String(stepData.remainder).length
          );

          const levelMargin = LEVEL_INDENT_SIZE * index;

          return (
            <Box
              key={index}
              sx={{
                ml: levelMargin,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid black',
                  minWidth: `${maxLength * 16}px`,
                  justifyContent: 'flex-end',
                }}>

                  {stepData.coef && (
                    <Typography sx={{
                      fontWeight: 700,
                      textAlign: 'right',
                      fontSize: '1.8rem',
                      letterSpacing: 12,
                      paddingRight: 0.5,
                    }}>
                      {stepData.coef}
                    </Typography>
                  )}
                </Box>

                {stepData.remainder && (
                  <Typography sx={{
                    fontWeight: 700,
                    fontSize: '1.8rem',
                    color: 'success.main',
                    textAlign: 'left',
                    letterSpacing: 12,
                  }}>
                    {stepData.remainder}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    )
  }


  return (
    <Paper
      elevation={2}
      sx={{
        width: 400,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={700}
          gutterBottom
        >
          {data.questionText}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack direction={'row'} sx={{ width: "80%", position: 'relative', mx: 'auto' }}>
          <Box sx={{ width: "60%", pb: 2, pt: 0.5, pr: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: 'left',
                fontSize: '1.8rem',
                letterSpacing: 12,
              }}
            >
              {initialDividend}
            </Typography>

            <LeftSideStateVisualize />

            {steps && currentStep < steps?.length && steps[currentStep].Side === "left" && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <TextField
                  size="small"
                  value={leftInputFieldState}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, sumCharCount);
                    setLeftInputFieldState(value);
                  }}
                  onFocus={() => setShowLeftSideTooltip(true)}
                  onBlur={() => setShowLeftSideTooltip(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && leftInputFieldState !== '') {
                      const correctAnswer = steps[currentStep].Sum;

                      setLeftInputFieldState('');
                      setShowLeftSideTooltip(false);

                      if (leftSideStackItem.coef) {
                        setLeftSideStackItem({ ...leftSideStackItem, remainder: correctAnswer });
                      } else {
                        if (steps[currentStep].Hint.includes("Спусти")) {
                          leftSideStack[leftSideStack.length - 1].remainder = correctAnswer;
                        } else {
                          setLeftSideStackItem({ ...leftSideStackItem, coef: correctAnswer });
                        }
                      }

                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  sx={{
                    width: 24 * sumCharCount,
                    '& .MuiInputBase-root': {
                      padding: '2px',
                      height: '28px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '2px 3px',
                      letterSpacing: '0.6em',
                    }
                  }}
                />

                {showLeftSideTooltip && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '8px',
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      boxShadow: 1,
                      zIndex: 1,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '6px solid',
                        borderBottomColor: 'divider',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderBottom: '5px solid',
                        borderBottomColor: 'background.paper',
                        marginBottom: '-1px',
                      }
                    }}
                  >
                    {steps[currentStep].Hint ?? ""}
                  </Box>
                )}
              </Box>
            )}

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
                  fontSize: '1.8rem',
                  letterSpacing: 12,
                }}
              >
                {initialDivisor}
              </Typography>
            </Box>

            <Box sx={{ pl: 2, pt: 1, minHeight: 50, display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.8rem',
                  letterSpacing: 12,
                }}
              >
                {rightSideState}
              </Typography>


              {steps && currentStep < steps?.length && steps[currentStep].Side === "right" && (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <TextField
                    size="small"
                    value={rightInputFieldState}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                      setRightInputFieldState(value);
                    }}
                    onFocus={() => setShowRightSideTooltip(true)}
                    onBlur={() => setShowRightSideTooltip(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && rightInputFieldState !== '') {
                        const userAnswer = parseInt(rightInputFieldState);
                        const correctAnswer = steps[currentStep].Sum;

                        setCurrentStep(currentStep + 1);
                        setRightSideState(`${rightSideState}${correctAnswer}`);
                        setRightInputFieldState('');
                        setShowRightSideTooltip(false);
                      }
                    }}
                    sx={{
                      width: 28 * sumCharCount,
                      '& .MuiInputBase-root': {
                        padding: '2px',
                        height: '28px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '2px 3px',
                      }
                    }}
                  />

                  {showRightSideTooltip && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '30%',
                        left: '80%',
                        transform: 'translateY(-50%)',
                        marginLeft: '8px',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 1,
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        boxShadow: 1,
                        zIndex: 1,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          right: '100%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderRight: '6px solid',
                          borderRightColor: 'divider',
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          right: '100%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderRight: '5px solid',
                          borderRightColor: 'background.paper',
                          borderTop: '5px solid transparent',
                          borderBottom: '5px solid transparent',
                          marginRight: '-1px',
                        }
                      }}
                    >
                      {steps[currentStep].Hint ?? ""}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Stack>

















      </CardContent>
    </Paper>
  );
}