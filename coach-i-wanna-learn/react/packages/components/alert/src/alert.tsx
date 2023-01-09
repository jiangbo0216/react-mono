


/**
 * All credit goes to Chance (Reach UI), Haz (Reakit) and (fluentui)
 * for creating the base type definitions upon which we improved on
 */
import { forwardRef as forwardReactRef } from "react"

import {
  createContext as createReactContext,
  useContext as useReactContext,
} from "react"

export interface CreateContextOptions<T> {
  strict?: boolean
  hookName?: string
  providerName?: string
  errorMessage?: string
  name?: string
  defaultValue?: T
}

export type CreateContextReturn<T> = [
  React.Provider<T>,
  () => T,
  React.Context<T>,
]

function getErrorMessage(hook: string, provider: string) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`
}

export function createContext<T>(options: CreateContextOptions<T> = {}) {
  const {
    name,
    strict = true,
    hookName = "useContext",
    providerName = "Provider",
    errorMessage,
  } = options

  const Context = createReactContext<T | undefined>(undefined)

  Context.displayName = name

  function useContext() {
    const context = useReactContext(Context)

    if (!context && strict) {
      const error = new Error(
        errorMessage ?? getErrorMessage(hookName, providerName),
      )
      error.name = "ContextError"
      Error.captureStackTrace?.(error, useContext)
      throw error
    }

    return context
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<T>
}



export type As<Props = any> = React.ElementType<Props>

// 以 OverrideProps 为准
export type RightJoinProps<
  SourceProps extends object = {},
  OverrideProps extends object = {}
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps


export type OmitCommonProps<
  Target,
  OmitAdditionalProps extends keyof any = never,
> = Omit<Target, "transition" | "as" | "color" | OmitAdditionalProps>

/**
 * Extract the props of a React element or component
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As
}

export type ComponentWithAs<Component extends As, Props extends object = {}> = {
  <AsComponent extends As = Component>(
    props: MergeWithAs<
      React.ComponentProps<Component>,
      React.ComponentProps<AsComponent>,
      Props,
      AsComponent
    >,
  ): JSX.Element

  displayName?: string
  propTypes?: React.WeakValidationMap<any>
  contextTypes?: React.ValidationMap<any>
  defaultProps?: Partial<any>
  id?: string
}

export type MergeWithAs<
  ComponentProps extends object,
  AsProps extends object,
  AdditionalProps extends object = {},
  AsComponent extends As = As,
> = RightJoinProps<ComponentProps, AdditionalProps> &
  RightJoinProps<AsProps, AdditionalProps> & {
    as?: AsComponent
  }

export function forwardRef<Props extends object, Component extends As>(
  component: React.ForwardRefRenderFunction<
    any,
    RightJoinProps<PropsOf<Component>, Props> & {
      as?: As
    }
  >,
) {
  return forwardReactRef(component) as unknown as ComponentWithAs<
    Component,
    Props
  >
}





const STATUSES = {
  info: { icon: "", colorScheme: "blue" },
  warning: { icon: "", colorScheme: "orange" },
  success: { icon: "", colorScheme: "green" },
  error: { icon: "", colorScheme: "red" },
  loading: { icon: "", colorScheme: "blue" },
}

export type AlertStatus = keyof typeof STATUSES


interface AlertOptions {
  /**
   * The status of the alert
   * @default "info"
   */
  status?: AlertStatus
}

const [AlertProvider, useAlertContext] = createContext<any>({
  name: "AlertContext",
  hookName: "useAlertContext",
  providerName: "<Alert />",
})

export {
  AlertProvider,
  useAlertContext
}

export const Alert = forwardRef<any, "div">(function (props, ref) {

  const status = "info"
  const addRole = true


  return (
    <AlertProvider value={{ status }}>
      <div
        role={addRole ? "alert" : undefined}
        ref={ref}
      />
    </AlertProvider>
  )
})


Alert.displayName = "Alert"
