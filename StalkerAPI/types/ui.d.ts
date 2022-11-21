/** @customConstructor CUIGameCustom */
declare class CUIGameCustom{
    GetCustomStatic(name: string): SDrawStaticStruct;
    AddCustomStatic(name: string, doAdd: boolean): void;

    // function HidePdaMenu()
    // function HideActorMenu()
    // function AddDialogToRender(CUIWindow*)
    // function RemoveDialogToRender(CUIWindow*)
    // function show_messages()
    // function hide_messages()
    // function RemoveCustomStatic(string)
	// function UpdateActorMenu
	// function CurrentItemAtCell
	// function update_fake_indicators
	// function enable_fake_indicators
}

/** @customConstructor SDrawStaticStruct */
declare class SDrawStaticStruct {
    wnd(): CUIStatic;
}

/** @customConstructor CUIStatic */
declare class CUIStatic extends CUIWindow {
    constructor();

    TextControl(): CUITextWnd;
    // function GetTextureRect()
    // function SetStretchTexture(boolean)
    // function SetTextureRect(Frect*)
    // function InitTexture(string)
	// function GetTextureColor()
	// function SetTextureColor(number)
	// -- Tronex: rotation
	// function EnableHeading(boolean)
	// function GetHeading()
	// function SetHeading(number)
	// function GetConstHeading()
	// function SetConstHeading(boolean)
}


/** @customConstructor CUIWindow */
declare class CUIWindow {
    constructor();
	
    Enable(doEnable: boolean): void;
    IsEnabled(): boolean;
    // function AttachChild(CUIWindow*)
    // function DetachChild(CUIWindow*)
    
    // function SetPPMode()
    ResetPPMode(): void;
    
    SetWindowName(name: string): void;
    WindowName(): string;
    
    Show(doShow: boolean): void;
    IsShown(): boolean;
    // function SetWndRect(Frect)
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

/** @customConstructor CUITextWnd */
declare class CUITextWnd extends CUIWindow {
    constructor();

    GetText(): string;
    SetText(text: string): void;
    SetTextST(text: string): void;
    // function SetTextAlignment(enum CGameFont::EAligment)
    // function SetTextComplexMode(boolean)
    // function GetTextColor()
    SetTextColor(color: ARGBColor): void;
    GetFont(): CGameFont;
    SetFont(font: CGameFont): void;
    // function SetTextOffset(number, number)
    // function AdjustHeightToText()
    // function AdjustWidthToText()
    // function SetEllipsis(boolean)
    // function SetVTextAlignment(enum EVTextAlignment)
}

/** @customConstructor CScriptXmlInit */
declare class CScriptXmlInit {
    constructor();
	
    // function InitSpinText(string, CUIWindow*)
    // function InitTab(string, CUIWindow*)
    InitStatic(path: string, owner: CUIWindow) : CUIStatic;
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
    // function InitScrollView(string, CUIWindow*)
    // function InitMPPlayerName(string, CUIWindow*)
    // function InitTrackBar(string, CUIWindow*)
    // function InitMapInfo(string, CUIWindow*)
    // function InitServerList(string, CUIWindow*)
    // function InitComboBox(string, CUIWindow*)
    // function InitFrameLine(string, CUIWindow*)
    // function Init3tButton(string, CUIWindow*)
    // function InitAnimStatic(string, CUIWindow*)
    // function InitFrame(string, CUIWindow*)
}