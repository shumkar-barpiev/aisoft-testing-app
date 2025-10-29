"use client";

import {
  Box,
  Button,
  Typography,
  CardContent,
  Stack,
  Divider,
  useTheme,
  Paper,
  TextField,
} from "@mui/material";

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { JSX } from "react/jsx-runtime";

type Step = {
  Id: number;
  D1: number;
  D2: number;
  Sum: number;
  Hint: string;
  Side: "left" | "right";
  action: "divide" | "multiply" | "subtract" | "bringDown";
};

type DivisionState = {
  Steps: readonly Step[];
  currentStepIndex: number;
  currentInput: string;
  quotientDigits: (number | null)[];
  remainderHistory: number[];
  isCompleted: boolean;
};

type FormValues = {
  dividend: number;
  divisor: number;
};


const generateSteps = (
  initialDividend: number,
  divisor: number
): Step[] => {
  if (divisor === 0) return [];

  const steps: Step[] = [];
  let stepId = 0;
  let dividendStr = String(initialDividend);
  let remainder = 0;
  let currentDividendPartStr = "";
  let currentQuotientIndex = 0;

  for (let i = 0; i < dividendStr.length || remainder !== 0; i++) {
    if (i < dividendStr.length) {
      currentDividendPartStr += dividendStr[i];
    }
    let currentDividendPart = remainder * 10 + (i < dividendStr.length ? parseInt(dividendStr[i]) : 0);

    if (i === 0) {
      currentDividendPart = parseInt(dividendStr.substring(0, String(divisor).length));
      if (currentDividendPart < divisor && dividendStr.length > String(divisor).length) {
        currentDividendPart = parseInt(dividendStr.substring(0, String(divisor).length + 1));
        currentDividendPartStr = dividendStr.substring(0, String(divisor).length + 1);
        i = String(divisor).length;
      } else if (currentDividendPart < divisor && dividendStr.length === String(divisor).length) {
        currentDividendPart = parseInt(dividendStr.substring(0, String(divisor).length));
        currentDividendPartStr = dividendStr.substring(0, String(divisor).length);
        i = String(divisor).length - 1;
      } else {
        currentDividendPartStr = dividendStr.substring(0, String(divisor).length);
        i = String(divisor).length - 1;
      }
    } else {
      if (currentDividendPart === remainder * 10 && i < dividendStr.length) {
        steps.push({
          Id: stepId++,
          D1: remainder,
          D2: parseInt(dividendStr[i]),
          Sum: remainder * 10 + parseInt(dividendStr[i]),
          Hint: `Спускаем цифру ${dividendStr[i]}. Получаем ${remainder * 10 + parseInt(dividendStr[i])}.`,
          Side: "left",
          action: "bringDown",
        });
        currentDividendPart = remainder * 10 + parseInt(dividendStr[i]);
        remainder = currentDividendPart;
      }
    }


    if (currentDividendPart < divisor && i < dividendStr.length - 1 && steps.length > 0 && steps[steps.length - 1].action !== 'bringDown') {
      continue;
    }

    const D1_for_division = remainder === 0 ? currentDividendPart : currentDividendPart;


    if (D1_for_division > 0 || i >= dividendStr.length - 1) {
      const quotientDigit = Math.floor(D1_for_division / divisor);

      steps.push({
        Id: stepId++,
        D1: D1_for_division,
        D2: divisor,
        Sum: quotientDigit,
        Hint: `Раздели ${D1_for_division} на ${divisor}. Получаем ${quotientDigit}.`,
        Side: "right",
        action: "divide",
      });

      const product = quotientDigit * divisor;
      steps.push({
        Id: stepId++,
        D1: quotientDigit,
        D2: divisor,
        Sum: product,
        Hint: `Умножь ${quotientDigit} на ${divisor}. Получаем ${product}.`,
        Side: "left",
        action: "multiply",
      });

      remainder = D1_for_division - product;
      steps.push({
        Id: stepId++,
        D1: D1_for_division,
        D2: product,
        Sum: remainder,
        Hint: `Вычти ${product} из ${D1_for_division}. Остаток: ${remainder}.`,
        Side: "left",
        action: "subtract",
      });

      currentQuotientIndex++;
    }

    if (remainder === 0 && i >= dividendStr.length - 1) {
      break;
    }

    if (i >= dividendStr.length - 1) break;
  }

  return steps;
};


export default function DivisionVisualizer() {
  const theme = useTheme();
  const [initialDividend, setInitialDividend] = useState(0);
  const [initialDivisor, setInitialDivisor] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const [division, setDivision] = useState<DivisionState>({
    Steps: [],
    currentStepIndex: 0,
    currentInput: "",
    quotientDigits: [],
    remainderHistory: [],
    isCompleted: false,
  });

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: { dividend: 0, divisor: 0 },
  });

  const currentStep = division.Steps[division.currentStepIndex];
  const fullQuotient = division.quotientDigits.filter(d => d !== null).join('');


  const generateDivisionSteps = (dividend: number, divisor: number) => {
    if (divisor === 0) {
      alert("Divisor cannot be zero!");
      return;
    }
    const steps = generateSteps(dividend, divisor);

    const quotientLength = String(Math.floor(dividend / divisor)).length;

    setDivision({
      Steps: steps,
      currentStepIndex: 0,
      currentInput: "",
      quotientDigits: Array(quotientLength).fill(null),
      remainderHistory: [],
      isCompleted: false,
    });
    setIsStarted(true);
  };

  const checkAnswer = () => {
    if (!currentStep) return;

    const expected = currentStep.Sum;
    const input = parseInt(division.currentInput);

    if (input === expected) {
      const newQuotientDigits = [...division.quotientDigits];
      const newRemainderHistory = [...division.remainderHistory];

      if (currentStep.action === "divide") {
        const quotientIndex = division.quotientDigits.findIndex(d => d === null);
        if (quotientIndex !== -1) {
          newQuotientDigits[quotientIndex] = input;
        }
      } else if (currentStep.action === "subtract") {
        newRemainderHistory.push(input);
      } else if (currentStep.action === "multiply") {
      } else if (currentStep.action === "bringDown") {
      }

      const nextIndex = division.currentStepIndex + 1;
      const isCompleted = nextIndex >= division.Steps.length;

      setDivision(prev => ({
        ...prev,
        currentStepIndex: nextIndex,
        currentInput: "",
        quotientDigits: newQuotientDigits,
        remainderHistory: newRemainderHistory,
        isCompleted: isCompleted,
      }));

    } else {
      alert("Неправильно! Попробуйте еще раз.");
    }
  };

  const currentRemainder = division.remainderHistory.length > 0 ? division.remainderHistory[division.remainderHistory.length - 1] : null;

  const DivisionGrid = useMemo(() => {
    if (!isStarted || division.Steps.length === 0) return null;

    const initialDividendStr = String(initialDividend);
    const initialDivisorStr = String(initialDivisor);

    const visualElements: JSX.Element[] = [];
    let currentY = 0;

    let currentDividendDisplay = initialDividendStr;
    let quotientDisplay = division.quotientDigits.map(d => d === null ? '_' : d).join('');

    const maxDigits = initialDividendStr.length;

    division.remainderHistory.forEach((remainder, index) => {
      const stepIndex = index * 3 + 2;
      const divideStep = division.Steps[stepIndex - 2];
      const multiplyStep = division.Steps[stepIndex - 1];
      const subtractStep = division.Steps[stepIndex];

      if (!divideStep || !multiplyStep || !subtractStep) return;

      const isCurrentBlock = index === division.remainderHistory.length - 1 && !division.isCompleted;

      visualElements.push(
        <Box key={`prod-${index}`} sx={{
          position: 'absolute',
          top: `${currentY + 60}px`,
          right: '40px',
          width: 100,
          textAlign: 'right',
          borderBottom: '1px solid black',
          opacity: 0.8,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: isCurrentBlock ? theme.palette.error.main : 'inherit' }}>
            {multiplyStep.Sum}
          </Typography>
        </Box>
      );

      visualElements.push(
        <Box key={`rem-${index}`} sx={{
          position: 'absolute',
          top: `${currentY + 100}px`,
          right: '40px',
          width: 100,
          textAlign: 'right',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: isCurrentBlock ? theme.palette.error.main : 'inherit' }}>
            {remainder}
          </Typography>
        </Box>
      );

      currentY += 80;
    });

    return (
      <Box sx={{ position: 'relative', width: '100%', minHeight: 300 }}>
        <Box sx={{
          position: 'absolute',
          top: '20px',
          right: '-120px',
          fontWeight: 700,
          fontSize: '1.8rem',
          letterSpacing: 4,
        }}>
          {division.quotientDigits.map((digit, i) => (
            <Typography
              key={`q-${i}`}
              component="span"
              variant="h5"
              sx={{
                fontWeight: 700,
                color: digit === null ? theme.palette.grey[400] : theme.palette.success.main,
                textDecoration: digit === null ? 'underline' : 'none',
                mr: '4px'
              }}
            >
              {digit === null ? (
                currentStep && currentStep.action === 'divide' && i === division.quotientDigits.findIndex(d => d === null) ?
                  <TextField
                    value={division.currentInput}
                    onChange={(e) => setDivision(prev => ({ ...prev, currentInput: e.target.value.slice(0, 1) }))}
                    size="small"
                    sx={{ width: 30, mr: 0, p: 0 }}
                    autoFocus
                    inputProps={{ style: { padding: '4px 0', textAlign: 'center' } }}
                  />
                  : '_'
              ) : digit}
            </Typography>
          ))}
        </Box>

        <Box sx={{ position: 'relative', width: '100%', minHeight: currentY + 150 }}>
          {visualElements}
        </Box>
      </Box>
    );
  }, [initialDividend, initialDivisor, isStarted, division, theme]);


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
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit((data) => {
          setInitialDividend(data.dividend);
          setInitialDivisor(data.divisor);
          generateDivisionSteps(data.dividend, data.divisor);
        })}
        sx={{ display: "flex", flexDirection: "row", gap: 2, width: 350, mb: 4 }}
      >
        <Controller
          name="dividend"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Делимое"
              type="number"
              size="small"
              error={field.value < initialDivisor && initialDivisor !== 0}
            />
          )}
        />

        <Controller
          name="divisor"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Делитель"
              type="number"
              size="small"
            />
          )}
        />

        <Button size="small" type="submit" variant="contained">
          Начать
        </Button>
      </Box>

      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ color: theme.palette.primary.main, mb: 4 }}
        >
          {isStarted ? `Деление ${initialDividend} ÷ ${initialDivisor}` : "Деление в столбик"}
        </Typography>

        <Stack direction={'row'} sx={{ width: 1, position: 'relative' }}>
          <Box sx={{ width: "60%", pb: 2, pt: 0.5, pr: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: 'right',
                fontSize: '1.8rem',
                letterSpacing: 4,
              }}
            >
              {initialDividend}
            </Typography>
            {DivisionGrid}
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
                {initialDivisor}
              </Typography>
            </Box>

            <Box sx={{ pl: 2, minHeight: 50, display: 'flex', flexDirection: 'column' }}>

            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 3, minHeight: 150 }}>
          {isStarted && !division.isCompleted && currentStep && (

            <Stack spacing={2} alignItems="center">

              <Paper
                elevation={4}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  textAlign: 'center',
                  minWidth: 300,
                  border: `2px solid ${theme.palette.info.dark}`,
                }}
              >
                <Typography variant="caption" sx={{ color: theme.palette.warning.main }}>
                  * Для шагов "Деление" ответ вводится в поле и нажмите «проверить».
                </Typography>
                <Typography variant="body1" fontWeight={600} >
                  Шаг-{division.currentStepIndex + 1}: {currentStep.Hint}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  label="Ваш ответ"
                  type="number"
                  value={division.currentInput}
                  onChange={(e) => setDivision(prev => ({ ...prev, currentInput: e.target.value }))}
                  size="small"
                  autoFocus={currentStep.action !== 'divide'}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      checkAnswer();
                    }
                  }}
                />
                <Button variant="contained" onClick={checkAnswer}>
                  Проверить
                </Button>
              </Box>


            </Stack>
          )}


          {division.isCompleted && (
            <Typography variant="h5" align="center" color="green">
              Отлично! Деление выполнено правильно. Ответ: {fullQuotient}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Paper>
  );
}