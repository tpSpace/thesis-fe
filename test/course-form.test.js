import { test, expect, describe, mock, beforeAll } from "bun:test";
import { JSDOM } from "jsdom";
import React from "react";
import { renderToString } from "react-dom/server";

// Set up global.React first
global.React = require("react");

console.log("[DEBUG] Starting test setup...");

// Set up a minimal DOM environment
beforeAll(() => {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
  });

  // Set up DOM globals
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
  global.MouseEvent = dom.window.MouseEvent;
  global.KeyboardEvent = dom.window.KeyboardEvent;
  global.getComputedStyle = dom.window.getComputedStyle;
  
  // Mock browser APIs
  global.window.matchMedia = () => ({ matches: false });
  global.window.scrollTo = () => {};
  
  // React 18 compatibility
  global.IS_REACT_ACT_ENVIRONMENT = true;
  console.log("[DEBUG] DOM environment set up successfully.");
});

// Mock dependencies
const mockPush = mock(() => {
  console.log("[DEBUG] mockPush called.");
});
const mockUpsertCourse = mock(() => {
  console.log("[DEBUG] mockUpsertCourse called.");
  return Promise.resolve({ data: { upsertCourse: {} } });
});

mock.module("next/router", () => ({
  useRouter: () => {
    console.log("[DEBUG] useRouter called.");
    return { push: mockPush };
  },
}));

mock.module("@apollo/client", () => ({
  useMutation: () => {
    console.log("[DEBUG] useMutation called.");
    return [mockUpsertCourse, { loading: false }];
  },
  useQuery: () => {
    console.log("[DEBUG] useQuery called.");
    return {
      loading: false,
      data: {
        allUser: [
          { id: 1, firstName: "John", lastName: "Doe" },
          { id: 2, firstName: "Jane", lastName: "Smith" },
        ],
      },
      error: null,
    };
  },
}));

// Mock form components
mock.module("../src/components/hook-form", () => {
  console.log("[DEBUG] Mocking hook-form components.");
  return {
    FormProvider: function FormProvider(props) {
      return React.createElement(
        "div",
        { "data-testid": "form-provider" },
        props.children
      );
    },
    RHFTextField: function RHFTextField(props) {
      return React.createElement("input", {
        "data-testid": `field-${props.name}`,
        name: props.name,
        placeholder: props.label,
      });
    },
    RHFSelect: function RHFSelect(props) {
      return React.createElement(
        "select",
        { "data-testid": `select-${props.name}`, name: props.name },
        props.children
      );
    },
  };
});

mock.module("../src/components/hook-form/RHFDatePicker", () => {
  console.log("[DEBUG] Mocking RHFDatePicker.");
  return {
    default: function RHFDatePicker(props) {
      return React.createElement("input", {
        "data-testid": `date-${props.name}`,
        type: "date",
        name: props.name,
        placeholder: props.label,
      });
    },
  };
});
