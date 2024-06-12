import { Context, Message } from "../hooks/useFiniteStateMachine";

export type State =
  | "CHECKING"
  | "ACCOUNT_DOES_NOT_EXIST"
  | "ACCOUNT_EXISTS"
  | "ACCOUNT_IMPORT"
  | "ACCOUNT_RESET"
  | "LOGGED_IN"
  | "ON_CHAIN_UPDATE_IN_PROGRESS";

export type Action =
  | "DISCONNECT_WALLET"
  | "REQUEST_CONTEXT"
  | "FOUND_NO_ACCOUNT"
  | "FOUND_ACCOUNT"
  | "ACCOUNT_RESET_REQUESTED"
  | "ACCOUNT_RESET_SUCCESS"
  | "ACCOUNT_IMPORT_SUCCESS"
  | "ACCOUNT_CREATION_SUCCESS"
  | "ACCOUNT_CREATION_FAILURE"
  | "SYNC_SUCCESS"
  | "ON_CHAIN_UPDATE_SUCCESS"
  | "UPDATING_CREDENTIALS_ON_CHAIN_STATUS"
  | "IMPORT_ACCOUNT";

export const calculateNextState = (
  currentContext: Context<State>,
  message: Message
): Context<State> => {
  let result;

  console.log(
    "[calculateNextState] currentContext: ",
    currentContext,
    message.action
  );

  switch (message.action as Action) {
    case "DISCONNECT_WALLET":
      result = {
        ...currentContext,
        state: "CHECKING" as State,
        action: message.action,
        send: true,
      };
      delete result.context.walletAddress;
      delete result.context.correctKey;
      delete result.context.createdAccount;
      return result;

    case "IMPORT_ACCOUNT":
      return {
        ...currentContext,
        action: message.action,
        state: "ACCOUNT_IMPORT" as State,
        send: false,
      };

    case "REQUEST_CONTEXT":
      return { ...currentContext, action: "UPDATE_CONTEXT", send: true };

    case "FOUND_NO_ACCOUNT":
      if (currentContext.state !== "CHECKING") return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "ACCOUNT_DOES_NOT_EXIST" as State,
        send: false,
      };

    case "FOUND_ACCOUNT":
      if (
        currentContext.state !== "CHECKING" &&
        currentContext.state !== "ACCOUNT_EXISTS"
      )
        return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "ACCOUNT_EXISTS" as State,
        send: true,
      };

    case "ACCOUNT_IMPORT_SUCCESS":
      if (currentContext.state != "ACCOUNT_IMPORT") return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "LOGGED_IN" as State,
        send: true,
      };

    case "ACCOUNT_RESET_REQUESTED":
      console.error("ACCOUNT_RESET_REQUESTED");
      // if (currentContext.state != "ACCOUNT_RESET") return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "ACCOUNT_RESET" as State,
        send: true,
      };

    case "ACCOUNT_RESET_SUCCESS":
      if (
        currentContext.state != "ACCOUNT_RESET" &&
        currentContext.state != "ACCOUNT_EXISTS"
      )
        return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "LOGGED_IN" as State,
        send: true,
      };

    case "ACCOUNT_CREATION_SUCCESS":
      if (currentContext.state !== "ACCOUNT_DOES_NOT_EXIST")
        return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "LOGGED_IN" as State,
        send: true,
      };

    case "ACCOUNT_CREATION_FAILURE":
      if (currentContext.state !== "ACCOUNT_DOES_NOT_EXIST")
        return currentContext;
      return {
        ...currentContext,
        action: message.action,
        context: { ...currentContext.context, ...message.data },
        state: "HOME" as State,
        send: true,
      };

    case "SYNC_SUCCESS":
      return {
        ...currentContext,
        action: "UPDATING_CREDENTIALS_ON_CHAIN_STATUS",
        state: "ON_CHAIN_UPDATE_IN_PROGRESS" as State,
        send: false,
      };

    case "ON_CHAIN_UPDATE_SUCCESS":
      return {
        ...currentContext,
        action: message.action,
        state: "LOGGED_IN" as State,
        send: false,
      };

    default:
      return {
        ...currentContext,
        context: { ...currentContext.context, ...message.data },
        send: false,
      };
  }
};
