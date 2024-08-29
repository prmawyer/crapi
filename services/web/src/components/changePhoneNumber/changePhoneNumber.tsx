import { Card, Steps } from "antd";

import React, { useState } from "react";

import PropTypes from "prop-types";

import TokenFormContainer from "../../containers/tokenForm/tokenForm";
import newPhoneNumberFormContainer from "../../containers/newPhoneNumberForm/newPhoneNumberForm";

const { Step } = Steps;

interface StepType {
  title: string;
  component: React.ComponentType<any>;
}

const ChangePhoneNumber: React.FC = () => {
  const steps: StepType[] = [
    {
      title: "New Phone Number",
      component: newPhoneNumberFormContainer,
    },
    {
      title: "Email Verification",
      component: TokenFormContainer,
    },
  ];

  const [number,setNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: number) => setCurrentStep(step);

  const handlePhoneNumberChange = (newNumber: string) => setNumber(newNumber);

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="container">
      <Card title="Change Phone Number" bordered={false} className="form-card">
        <Steps current={currentStep} size="small">
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <CurrentComponent
            currentStep={currentStep}
            setCurrentStep={handleStepChange}
            oldPhoneNumber={number}
            onPhoneNumberChange={handlePhoneNumberChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default ChangePhoneNumber;
