declare function log(this: void, data: string): void
declare function time_global(): number

type ScriptCallback = (...args: any[]) => void;
declare function RegisterScriptCallback(this: void, callbackName: string, callback : ScriptCallback) : Obj;

declare interface SHit{

}

declare interface CallbackReturnFlags{
  ret_value: boolean;
}

declare function obj(this: void) : Obj;
declare interface Obj{
  id(): string;
  section(): string;
}

declare interface Vector{

}
