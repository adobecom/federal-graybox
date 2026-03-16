import { RecoverableError } from "../../Error/Error";

export type Text = {
  type: "Text";
  content: string;
};

const ERRORS = {
  elementNull: "Error when parsing text. Element is null",
  textContentNull: "Error when parsing text. Element has no textContent",
}

export const parseText = (
  element: Element | null
): Parsed<Text, RecoverableError> => {
  if (element === null)
    return [
      {
        type: "Text" ,
        content: ""
      },
      [new RecoverableError(ERRORS.elementNull, "Minor")]
    ];      
  const content = element.textContent;
  if (content === null)
    return [
      {
        type: "Text",
        content: "",
      },
      [new RecoverableError(ERRORS.textContentNull, "Minor")]
    ];
  return [
    {
      type: "Text",
      content,
    },
    []
  ]
};

