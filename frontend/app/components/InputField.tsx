"use client";
import React from "react";

export default function InputField(props: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{props.label}</label>
      <input
        className="w-full rounded-md border px-3 py-2 text-black placeholder:text-gray-400"
        type={props.type || "text"}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.error ? (
        <p className="text-sm text-red-600">{props.error}</p>
      ) : null}
    </div>
  );
}
