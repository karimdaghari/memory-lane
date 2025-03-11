"use client";
import { SubmitButton } from "@/components/fields/submit-button";
import { TabsField } from "@/components/fields/tabs";
import { TextField } from "@/components/fields/text";
import { TextareaField } from "@/components/fields/textarea";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
		TextareaField,
		TabsField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
