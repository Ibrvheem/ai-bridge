"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { findBias } from "../service";
import { BiasResult } from "./bias-result";

interface BiasInputProps {
  placeholders: string[];
}

export function BiasInput({ placeholders }: BiasInputProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await findBias({ text });
      console.log("Submitted text:", text);
      setText(""); // Clear input after submission
      console.log("API Response:", response);
      setResult(response);
      return response;
    } catch (error) {
      console.error("Error submitting text:", error);
      return null;
    }
  };

  return (
    <div className="w-full min-h-[50vh] ">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      {result && <BiasResult result={result} />}
    </div>
  );
}
