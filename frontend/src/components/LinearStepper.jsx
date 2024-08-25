import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const steps = ['Food Collected', 'Delivery in Progress', 'Food Delivered'];

const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: ownerState.active ? '#fff' : '#fff',
  backgroundColor: ownerState.active ? '#9e9e9e' : '#5A5A5A' ,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
}));


function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ completed, active, icon: props.icon }} className={className}>
      <Typography color="inherit">{props.icon}</Typography>
    </CustomStepIconRoot>
  );
}

export default function LinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
  
          return (
            <Step key={label} {...stepProps}>
              <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} icon={index + 1} active={activeStep === index} />
              )}
            >
              {label}
            </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
  

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}