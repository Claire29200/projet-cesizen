import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { StressQuestion } from "@/store/diagnostic";

interface DiagnosticQuestionProps {
  question: StressQuestion;
  currentAnswer: number | undefined;
  onAnswer: (value: number) => void;
}

export function DiagnosticQuestion({ 
  question, 
  currentAnswer, 
  onAnswer 
}: DiagnosticQuestionProps) {
  const options = [
    { value: 0, label: "Jamais" },
    { value: 1, label: "Rarement" },
    { value: 2, label: "Parfois" },
    { value: 3, label: "Souvent" },
    { value: 4, label: "Très souvent" }
  ];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-medium text-mental-800 mb-6">
        {question.question}
      </h2>
      
      <RadioGroup
        value={currentAnswer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-3"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 p-2 rounded-md hover:bg-mental-50 transition-colors">
            <RadioGroupItem value={option.value.toString()} id={`option-${question.id}-${option.value}`} />
            <Label htmlFor={`option-${question.id}-${option.value}`} className="cursor-pointer w-full">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </motion.div>
  );
}
