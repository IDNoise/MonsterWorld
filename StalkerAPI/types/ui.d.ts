/** @customConstructor CUIGameCustom */
declare class CUIGameCustom{
    GetCustomStatic(name: string): SDrawStaticStruct;
    AddCustomStatic(name: string, doAdd: boolean): void;
    RemoveCustomStatic(name: string): void;

    HidePdaMenu(): void;
    HideActorMenu(): void;
    AddDialogToRender(dialog: CUIWindow): void;
    RemoveDialogToRender(dialog: CUIWindow): void;
    show_messages(): void;
    hide_messages(): void;
	// UpdateActorMenu
	// CurrentItemAtCell
	// update_fake_indicators
	// enable_fake_indicators
}

/** @customConstructor SDrawStaticStruct */
declare class SDrawStaticStruct {
    wnd(): CUIStatic;
}

declare class FRect{

}

/** @customConstructor CUIStatic */
declare class CUIStatic extends CUIWindow {
    constructor();

    TextControl(): CUITextWnd;
    GetTextureRect(): FRect;
    SetStretchTexture(stretch: boolean): void;
    SetTextureRect(rect: FRect): void
    InitTexture(path: string): void;
	GetTextureColor(): ARGBColor;
	SetTextureColor(color: ARGBColor): void;
	// -- Tronex: rotation
	// EnableHeading(boolean)
	// GetHeading()
	// SetHeading(number)
	// GetConstHeading()
	// SetConstHeading(boolean)
}


/** @customConstructor CUIWindow */
declare class CUIWindow {
    constructor();
	
    Enable(doEnable: boolean): void;
    IsEnabled(): boolean;
    AttachChild(child: CUIWindow): void;
    DetachChild(child: CUIWindow): void;
    
    SetPPMode(): void;
    ResetPPMode(): void;
    
    SetWindowName(name: string): void;
    WindowName(): string;
    
    Show(doShow: boolean): void;
    IsShown(): boolean;
    SetWndRect(rect: FRect): void;
    SetWndPos(pos: vector2): void;
    GetWndPos(): vector2;
    SetWndSize(size: vector2): void;
    GetWidth(): number;
    GetHeight(): number;
    SetAutoDelete(isAutoDelete: boolean): void;
    IsAutoDelete(): boolean;
}

/** @customConstructor CUIProgressBar */
declare class CUIProgressBar extends CUIWindow {
    constructor();

    // function GetRange_max()
    // function GetRange_min()
    SetProgressPos(pct: number): void;
    GetProgressPos(): number;
    ShowBackground(doShow: boolean): void;
    SetColor(color: ARGBColor): void;
    UseColor(doUse: boolean): void;
    // function SetMinColor(number)
    // function SetMiddleColor(number)
    // function SetMaxColor(number)
}

declare const enum EHTextAligment{
    alLeft = 0,
    alRight,
    alCenter
}

declare const enum EVTextAlignment{
    valTop = 0,
	valCenter,
	valBotton
}

/** @customConstructor CUITextWnd */
declare class CUITextWnd extends CUIWindow {
    constructor();

    GetText(): string;
    SetText(text: string): void;
    SetTextST(text: string): void;
    SetTextAlignment(value: EHTextAligment): void;
    SetVTextAlignment(value: EVTextAlignment): void
    // function SetTextComplexMode(boolean)
    // function GetTextColor()
    SetTextColor(color: ARGBColor): void;
    GetFont(): CGameFont;
    SetFont(font: CGameFont): void;
    // function SetTextOffset(number, number)
    AdjustHeightToText(): void;
    AdjustWidthToText(): void;
    // function SetEllipsis(boolean)
    
}

/** @customConstructor CUIScrollView */
declare class  CUIScrollView extends CUIWindow {
    constructor ()
	
    AddWindow(child: CUIWindow, dunno: boolean): void;
    RemoveWindow(child: CUIWindow): void;
    // function SetScrollPos(number)
    // function ScrollToBegin()
	// function SetFixedScrollBar(boolean)
    // function GetCurrentScrollPos()
    // function GetMaxScrollPos()
    // function GetMinScrollPos()
    // function ScrollToEnd()
    // function Clear()
}

/** @customConstructor CScriptXmlInit */
declare class CScriptXmlInit {
    constructor();
	
    // function InitSpinText(string, CUIWindow*)
    // function InitTab(string, CUIWindow*)
    InitStatic(path: string, owner: CUIWindow | undefined) : CUIStatic;
    // function InitSleepStatic(string, CUIWindow*)
    InitTextWnd(path: string, owner: CUIWindow): CUITextWnd;
    // function InitSpinFlt(string, CUIWindow*)
    InitProgressBar(path: string, owner: CUIWindow): CUIProgressBar;
    // function InitSpinNum(string, CUIWindow*)
    // function InitMapList(string, CUIWindow*)
    ParseFile(name: string): void;
    // function InitCDkey(string, CUIWindow*)
    // function InitListBox(string, CUIWindow*)
    // function InitKeyBinding(string, CUIWindow*)
    // function InitMMShniaga(string, CUIWindow*)
    // function InitWindow(string, number, CUIWindow*)
    // function InitEditBox(string, CUIWindow*)
    // function InitCheck(string, CUIWindow*)
    InitScrollView(path: string, owner: CUIWindow): CUIScrollView
    // function InitMPPlayerName(string, CUIWindow*)
    // function InitTrackBar(string, CUIWindow*)
    // function InitMapInfo(string, CUIWindow*)
    // function InitServerList(string, CUIWindow*)
    // function InitComboBox(string, CUIWindow*)
    // function InitFrameLine(string, CUIWindow*)
    Init3tButton(path: string, owner: CUIWindow): CUI3tButton;
    // function InitAnimStatic(string, CUIWindow*)
    // function InitFrame(string, CUIWindow*)
}

/** @customConstructor CUIButton */
declare class CUIButton extends CUIStatic {
    constructor ()
	
    TextControl(): CUITextWnd;
}

/** @customConstructor CUI3tButton */
declare class CUI3tButton extends CUIButton {
    constructor ()
}
