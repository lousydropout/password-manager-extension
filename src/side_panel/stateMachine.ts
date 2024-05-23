import { Context, Message } from "../hooks/useFiniteStateMachine";

export type State =
  | "CHECKING"
  | "ACCOUNT_DOES_NOT_EXIST"
  | "ACCOUNT_EXISTS"
  | "ACCOUNT_IMPORT"
  | "ACCOUNT_RESET"
  | "LOGGED_IN";

export type Action =
  | "DISCONNECT_WALLET"
  | "REQUEST_CONTEXT"
  | "FOUND_NO_ACCOUNT"
  | "FOUND_ACCOUNT"
  | "ACCOUNT_RESET_REQUESTED"
  | "ACCOUNT_RESET_SUCCESS"
  | "ACCOUNT_IMPORT_SUCCESS"
  | "ACCOUNT_CREATION_SUCCESS"
  | "ACCOUNT_CREATION_FAILURE";

export const calculateNextState = (
  currentContext: Context<State>,
  message: Message
): Context<State> => {
  console.log("(prevState, action): ", message.action, currentContext, message);
  let result;

  switch (message.action as Action) {
    case "DISCONNECT_WALLET":
      result = {
        ...currentContext,
        state: "CHECKING",
        action: message.action,
        send: true,
      };
      delete result.context.walletAddress;
      delete result.context.correctKey;
      delete result.context.createdAccount;
      return result as Context<State>;

    case "REQUEST_CONTEXT":
      result = { ...currentContext, action: "UPDATE_CONTEXT", send: true };
      console.debug(
        "[REQUEST_CONTEXT]: ",
        currentContext.state,
        message,
        result
      );
      return result as Context<State>;

    case "FOUND_NO_ACCOUNT":
      if (currentContext.state !== "CHECKING") return currentContext;
      result = {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "ACCOUNT_DOES_NOT_EXIST",
        send: false,
      };
      console.debug(
        "[FOUND_NO_ACCOUNT -> ACCOUNT_DOES_NOT_EXIST]: ",
        currentContext.state,
        message,
        result
      );
      return result as Context<State>;

    case "FOUND_ACCOUNT":
      if (currentContext.state !== "CHECKING") return currentContext;
      result = {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "ACCOUNT_EXISTS",
        send: true,
      };
      console.debug(
        "[FOUND_ACCOUNT -> ACCOUNT_EXISTS]: ",
        currentContext.state,
        message,
        result
      );
      return result as Context<State>;

    case "ACCOUNT_IMPORT_SUCCESS":
      if (currentContext.state != "ACCOUNT_EXISTS") return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "LOGGED_IN",
        send: true,
      } as Context<State>;

    case "ACCOUNT_RESET_REQUESTED":
      if (currentContext.state != "ACCOUNT_RESET") return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "ACCOUNT_RESET",
        send: true,
      } as Context<State>;

    case "ACCOUNT_RESET_SUCCESS":
      if (currentContext.state != "ACCOUNT_RESET") return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "LOGGED_IN",
        send: true,
      } as Context<State>;

    case "ACCOUNT_CREATION_SUCCESS":
      if (currentContext.state !== "ACCOUNT_DOES_NOT_EXIST")
        return currentContext;
      result = {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "LOGGED_IN",
        send: true,
      };
      console.debug(
        "[ACCOUNT_CREATION_SUCCESS -> LOGGED_IN]: ",
        currentContext.state,
        message,
        result
      );
      return result as Context<State>;

    case "ACCOUNT_CREATION_FAILURE":
      if (currentContext.state !== "ACCOUNT_DOES_NOT_EXIST")
        return currentContext;
      result = {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "HOME",
        send: true,
      };
      console.debug(
        "[ACCOUNT_CREATION_FAILURE -> HOME]: ",
        currentContext.state,
        message,
        result
      );
      return result as Context<State>;

    default:
      result = {
        ...currentContext,
        context: { ...currentContext.context, ...message.data },
        send: false,
      };
      console.debug("[default]: ", currentContext, message, result);
      return result;
  }
};
