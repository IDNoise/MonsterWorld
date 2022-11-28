type MCMMainGroup = {
    id: string, //Mod name
    gr: MCMSubGroup[],
}

type MCMSubGroup ={
    id: string, //Group name
    sh: boolean, //used to detemine that the sub-tree tables are actual list of options to set and show
    gr: MCMSubGroup[] | MCMElement[]
}

interface MCMElement {

    // Option identity/name.
	// 	Option get stored in axr_main or called in other sripts by its path (IDs of sub trees and option):
	// 		Example: ( tree_1_id/tree_2_id/.../option_id ) 
	// 	The top id in the table you return to MCM (tree_1_id in the above example) should be as unique as 
	// 		posible to prevent it from conflicting with another mod.
    id: string, 
    type: MCMElementType,

    // - Used by: support elements: "slide" / "title" / "desc"
	// 	String to show near the image, it will be translated
    text?: string,

    // - Used by: support elements: "title"
	// 	determines the alignment of the title
    align?: MCMTextAligment,

    // - Used by: option elements: ALL
	// 	Option's value type: 0. string | 1. boolean | 2. float
	// 	It tells the script what kind of value the option is storing / dealing with
    val?: MCMValueType

    // - Define: ( table {a,r,b,g} )
	// - Used by: support elements: "title" / "desc"
	// 	determines the color of the text
    clr?: [number, number, number, number],

    // - Used by: support elements: "image" / "slide"
	// 	Link to texture you want to show
    link?: string,

    // - Define: ( table {w,z} )
	// - Used by: support elements: "slide"
	// 	custom size for the texture
    size?: [number, number],

    // - Used by: support elements: "slide"
	// 	hight offset to add extra space
    spacing?: number,

    // - Define: (boolean) / (number) / (string) / ( table {function, parameters} )
	// - Used by: option elements: ALL (not needed if [cmd] is used)
	// 	Default value of an option
	// 	when no cached values are found in axr_options, the default value will be used
    def?: string | boolean | number

    // - Used by: option elements: "input" / "track": (only if [val] = 2)
	// 	Minimum viable value for an option, to make sure a value stays in range
    min?: number,

	// - Used by: option elements:  "input" / "track": (only if [val] = 2)
	// 	Maximum viable value for an option, to make sure a value stays in range
    max?: number,

	// - Used by: option elements: "track": (only if [val] = 2)
	// 	How much a value can be increased/decreased in one step
    step?: number,
}

declare const enum MCMElementType {
    Line = "line", //Support element, a simple line to separate things around
    Title = "title", //Support element, title (left/right/center alignment)
    Slide = "slide", //Support element, image box on left, text on right
    Image = "image", //Support element, 563x50 px image box, full-area coverage
    Descritpion = "desc", //Support element, description (left alignment)

    Checkbox = "check", //Option, check box, either ON or OFF
    List = "list", //Option, list of strings, useful for options with too many selections
    Input = "input", //Option, input box, you can type a value of your choice
    RadioH = "radio_h", //Option, radio box, select one out of many choices. Can fit up to 8 selections (Horizental layout)
    RadioV = "radio_v", //Option, radio box, select one out of many choices. Can fit up any number of selections (Vertical layout)
    Track = "track", //Option, track bar, easy way to control numric options with min/max values (can be used only if [val] = 2)
    KeyBind = "key_bind", //Option, button that registers a keypress after being clicked. (See suplimental instructions below)
}

declare const enum MCMTextAligment {
    Right = "r",
    Left = "l",
    Center = "c"
}

declare const enum MCMValueType{
    String = 0,
    Bool = 1,
    Number = 2
}

declare namespace ui_mcm{
    function get<T>(path: string): T;
}