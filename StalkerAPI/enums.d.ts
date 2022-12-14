declare const enum HitType {
    burn = 0,
    shock = 1,
    chemical_burn = 2,
    radiation = 3,
    telepatic = 4,
    strike = 5,
    wound = 6,
    explosion = 7,
    fire_wound = 8,
    light_burn = 11,
    dummy = 12,
}

declare const enum ui_events {
    BUTTON_CLICKED = 17,
    BUTTON_DOWN = 18,
    CHECK_BUTTON_RESET = 21,
    CHECK_BUTTON_SET = 20,
    EDIT_TEXT_COMMIT = 71,
    LIST_ITEM_CLICKED = 35,
    LIST_ITEM_SELECT = 36,
    MESSAGE_BOX_CANCEL_CLICKED = 44,
    MESSAGE_BOX_COPY_CLICKED = 45,
    MESSAGE_BOX_NO_CLICKED = 43,
    MESSAGE_BOX_OK_CLICKED = 39,
    MESSAGE_BOX_QUIT_GAME_CLICKED = 42,
    MESSAGE_BOX_QUIT_WIN_CLICKED = 41,
    MESSAGE_BOX_YES_CLICKED = 40,
    PROPERTY_CLICKED = 38,
    RADIOBUTTON_SET = 22,
    SCROLLBAR_HSCROLL = 32,
    SCROLLBAR_VSCROLL = 31,
    SCROLLBOX_MOVE = 30,
    TAB_CHANGED = 19,
    WINDOW_KEY_PRESSED = 10,
    WINDOW_KEY_RELEASED = 11,
    WINDOW_LBUTTON_DB_CLICK = 9,
    WINDOW_LBUTTON_DOWN = 0,
    WINDOW_LBUTTON_UP = 3,
    WINDOW_MOUSE_MOVE = 6,
    WINDOW_RBUTTON_DOWN = 1,
    WINDOW_RBUTTON_UP = 4,
}

declare const enum ClsId{
    art_bast_artefact = 0,
    art_black_drops = 1,
    art_gravi_black = 2,
    art_cta = 3,
    art_dummy = 4,
    art_electric_ball = 5,
    art_faded_ball = 6,
    art_galantine = 7,
    art_gravi = 8,
    art_mercury_ball = 9,
    art_needles = 10,
    art_rusty_hair = 11,
    art_thorn = 12,
    art_zuda = 13,
    bloodsucker = 14,
    boar = 15,
    burer = 16,
    cat = 17,
    controller = 18,
    crow = 19,
    dog_black = 20,
    psy_dog_phantom = 21,
    psy_dog = 22,
    dog_red = 23,
    flesh = 24,
    flesh_group = 25,
    fracture = 26,
    pseudo_gigant = 27,
    graph_point = 28,
    chimera = 29,
    phantom = 30,
    poltergeist = 31,
    rat = 32,
    snork = 33,
    stalker = 34,
    script_stalker = 35,
    trader = 36,
    script_trader = 37,
    tushkano = 38,
    zombie = 39,
    wpn_ammo = 40,
    wpn_ammo_s = 41,
    artefact = 42,
    wpn_ammo_m209 = 43,
    wpn_ammo_og7b = 44,
    wpn_ammo_vog25 = 45,
    game_cl_artefact_hunt = 46,
    game_cl_capture_the_artefact = 47,
    game_cl_deathmatch = 48,
    game_cl_single = 49,
    game_cl_team_deathmatch = 50,
    helicopter = 51,
    script_heli = 52,
    car = 53,
    detector_advanced_s = 54,
    detector_elite_s = 55,
    detector_scientific_s = 56,
    detector_simple_s = 57,
    device_detector_advanced = 58,
    device_custom = 59,
    device_dosimeter = 60,
    device_detector_elite = 61,
    device_flashlight = 62,
    device_flare = 63,
    device_pda = 64,
    device_detector_scientific = 65,
    device_detector_simple = 66,
    device_torch = 67,
    equ_exo = 68,
    equ_military = 69,
    equ_scientific = 70,
    equ_stalker = 71,
    equ_backpack = 72,
    helmet = 73,
    equ_helmet_s = 74,
    equ_stalker_s = 75,
    wpn_grenade_f1 = 76,
    wpn_grenade_f1_s = 77,
    wpn_grenade_fake = 78,
    level = 79,
    game = 80,
    wpn_grenade_rgd5 = 81,
    wpn_grenade_rgd5_s = 82,
    wpn_grenade_rpg7 = 83,
    hud_manager = 84,
    obj_antirad = 85,
    obj_attachable = 86,
    obj_bandage = 87,
    obj_bolt = 88,
    obj_bottle = 89,
    obj_document = 90,
    obj_explosive = 91,
    obj_food = 92,
    obj_medkit = 93,
    level_changer = 94,
    level_changer_s = 95,
    main_menu = 96,
    mp_players_bag = 97,
    online_offline_group = 98,
    online_offline_group_s = 99,
    actor = 100,
    obj_breakable = 101,
    obj_climable = 102,
    destrphys_s = 103,
    hanging_lamp = 104,
    obj_holder_ent = 105,
    inventory_box = 106,
    obj_physic = 107,
    script_phys = 108,
    projector = 109,
    obj_phys_destroyable = 110,
    obj_phskeleton = 111,
    script_zone = 112,
    artefact_s = 113,
    car_s = 114,
    script_object = 115,
    smart_cover = 116,
    smart_terrain = 117,
    smart_zone = 118,
    smartcover_s = 119,
    bloodsucker_s = 120,
    boar_s = 121,
    burer_s = 122,
    cat_s = 123,
    chimera_s = 124,
    controller_s = 125,
    psy_dog_phantom_s = 126,
    psy_dog_s = 127,
    dog_s = 128,
    flesh_s = 129,
    gigant_s = 130,
    fracture_s = 131,
    poltergeist_s = 132,
    pseudodog_s = 133,
    rat_s = 134,
    snork_s = 135,
    tushkano_s = 136,
    zombie_s = 137,
    hlamp_s = 138,
    space_restrictor = 139,
    script_restr = 140,
    spectator = 141,
    game_sv_artefact_hunt = 142,
    game_sv_capture_the_artefact = 143,
    game_sv_deathmatch = 144,
    game_sv_single = 145,
    game_sv_team_deathmatch = 146,
    script_actor = 147,
    obj_explosive_s = 148,
    obj_food_s = 149,
    inventory_box_s = 150,
    wpn_ammo_m209_s = 151,
    wpn_ammo_og7b_s = 152,
    obj_pda_s = 153,
    wpn_ammo_vog25_s = 154,
    device_torch_s = 155,
    game_ui_artefact_hunt = 156,
    game_ui_capture_the_artefact = 157,
    game_ui_deathmatch = 158,
    game_ui_single = 159,
    game_ui_team_deathmatch = 160,
    wpn_ak74_s = 161,
    wpn_auto_shotgun_s = 162,
    wpn_binocular_s = 163,
    wpn_bm16_s = 164,
    wpn_grenade_launcher_s = 165,
    wpn_groza_s = 166,
    wpn_hpsa_s = 167,
    wpn_knife_s = 168,
    wpn_lr300_s = 169,
    wpn_pm_s = 170,
    wpn_rg6_s = 171,
    wpn_rpg7_s = 172,
    wpn_scope_s = 173,
    wpn_shotgun_s = 174,
    wpn_silencer_s = 175,
    wpn_svd_s = 176,
    wpn_svu_s = 177,
    wpn_usp45_s = 178,
    wpn_val_s = 179,
    wpn_vintorez_s = 180,
    wpn_walther_s = 181,
    wpn_ak74 = 182,
    wpn_binocular = 183,
    wpn_bm16 = 184,
    wpn_fn2000 = 185,
    wpn_fort = 186,
    wpn_grenade_launcher = 187,
    wpn_groza = 188,
    wpn_hpsa = 189,
    wpn_knife = 190,
    wpn_lr300 = 191,
    wpn_pm = 192,
    wpn_rg6 = 193,
    wpn_rpg7 = 194,
    wpn_scope = 195,
    wpn_shotgun = 196,
    wpn_silencer = 197,
    wpn_stat_mgun = 198,
    wpn_svd = 199,
    wpn_svu = 200,
    wpn_usp45 = 201,
    wpn_val = 202,
    wpn_vintorez = 203,
    wpn_walther = 204,
    wpn_wmagaz = 205,
    wpn_wmaggl = 206,
    zone_ameba_s = 207,
    zone_bfuzz_s = 208,
    zone_galant_s = 209,
    zone_mbald_s = 210,
    zone_mincer_s = 211,
    zone_nograv_s = 212,
    zone_radio_s = 213,
    zone_torrid_s = 214,
    zone_acid_fog = 215,
    ameba_zone = 216,
    zone_bfuzz = 217,
    zone_campfire = 218,
    zone_dead = 219,
    zone_galantine = 220,
    zone_mosquito_bald = 221,
    zone_mincer = 222,
    nogravity_zone = 223,
    zone_radioactive = 224,
    zone_rusty_hair = 225,
    team_base_zone = 226,
    torrid_zone = 227,
    zone = 228
}

declare enum DIK_keys {
    DIK_0 = 11,
    DIK_1 = 2,
    DIK_2 = 3,
    DIK_3 = 4,
    DIK_4 = 5,
    DIK_5 = 6,
    DIK_6 = 7,
    DIK_7 = 8,
    DIK_8 = 9,
    DIK_9 = 10,
    DIK_A = 30,
    DIK_ADD = 78,
    DIK_APOSTROPHE = 40,
    DIK_APPS = 221,
    DIK_AT = 145,
    DIK_AX = 150,
    DIK_B = 48,
    DIK_BACK = 14,
    DIK_BACKSLASH = 43,
    DIK_C = 46,
    DIK_CAPITAL = 58,
    DIK_CIRCUMFLEX = 144,
    DIK_COLON = 146,
    DIK_COMMA = 51,
    DIK_CONVERT = 121,
    DIK_D = 32,
    DIK_DECIMAL = 83,
    DIK_DELETE = 211,
    DIK_DIVIDE = 181,
    DIK_DOWN = 208,
    DIK_E = 18,
    DIK_END = 207,
    DIK_EQUALS = 13,
    DIK_ESCAPE = 1,
    DIK_F = 33,
    DIK_F1 = 59,
    DIK_F10 = 68,
    DIK_F11 = 87,
    DIK_F12 = 88,
    DIK_F13 = 100,
    DIK_F14 = 101,
    DIK_F15 = 102,
    DIK_F2 = 60,
    DIK_F3 = 61,
    DIK_F4 = 62,
    DIK_F5 = 63,
    DIK_F6 = 64,
    DIK_F7 = 65,
    DIK_F8 = 66,
    DIK_F9 = 67,
    DIK_G = 34,
    DIK_GRAVE = 41,
    DIK_H = 35,
    DIK_HOME = 199,
    DIK_I = 23,
    DIK_INSERT = 210,
    DIK_J = 36,
    DIK_K = 37,
    DIK_KANA = 112,
    DIK_KANJI = 148,
    DIK_L = 38,
    DIK_LBRACKET = 26,
    DIK_LCONTROL = 29,
    DIK_LEFT = 203,
    DIK_LMENU = 56,
    DIK_LSHIFT = 42,
    DIK_LWIN = 219,
    DIK_M = 50,
    DIK_MINUS = 12,
    DIK_MULTIPLY = 55,
    DIK_N = 49,
    DIK_NEXT = 209,
    DIK_NOCONVERT = 123,
    DIK_NUMLOCK = 69,
    DIK_NUMPAD0 = 82,
    DIK_NUMPAD1 = 79,
    DIK_NUMPAD2 = 80,
    DIK_NUMPAD3 = 81,
    DIK_NUMPAD4 = 75,
    DIK_NUMPAD5 = 76,
    DIK_NUMPAD6 = 77,
    DIK_NUMPAD7 = 71,
    DIK_NUMPAD8 = 72,
    DIK_NUMPAD9 = 73,
    DIK_NUMPADCOMMA = 179,
    DIK_NUMPADENTER = 156,
    DIK_NUMPADEQUALS = 141,
    DIK_O = 24,
    DIK_P = 25,
    DIK_PAUSE = 197,
    DIK_PERIOD = 52,
    DIK_PRIOR = 201,
    DIK_Q = 16,
    DIK_R = 19,
    DIK_RBRACKET = 27,
    DIK_RCONTROL = 157,
    DIK_RETURN = 28,
    DIK_RIGHT = 205,
    DIK_RMENU = 184,
    DIK_RSHIFT = 54,
    DIK_RWIN = 220,
    DIK_S = 31,
    DIK_SCROLL = 70,
    DIK_SEMICOLON = 39,
    DIK_SLASH = 53,
    DIK_SPACE = 57,
    DIK_STOP = 149,
    DIK_SUBTRACT = 74,
    DIK_SYSRQ = 183,
    DIK_T = 20,
    DIK_TAB = 15,
    DIK_U = 22,
    DIK_UNDERLINE = 147,
    DIK_UNLABELED = 151,
    DIK_UP = 200,
    DIK_V = 47,
    DIK_W = 17,
    DIK_X = 45,
    DIK_Y = 21,
    DIK_YEN = 125,
    DIK_Z = 44,
    MOUSE_1 = 337,
    MOUSE_2 = 338,
    MOUSE_3 = 339,
}

declare enum key_bindings {
    kACCEL = 6,
    kBACK = 9,
    kBUY = 48,
    kCAM_1 = 14,
    kCAM_2 = 15,
    kCAM_3 = 16,
    kCAM_ZOOM_IN = 17,
    kCAM_ZOOM_OUT = 18,
    kCHAT = 42,
    kCONSOLE = 46,
    kCROUCH = 5,
    kDOWN = 3,
    kDROP = 39,
    kFWD = 8,
    kINVENTORY = 47,
    kJUMP = 4,
    kLEFT = 0,
    kL_LOOKOUT = 12,
    kL_STRAFE = 10,
    kNIGHT_VISION = 20,
    kQUIT = 45,
    kRIGHT = 1,
    kR_LOOKOUT = 13,
    kR_STRAFE = 11,
    kSCORES = 41,
    kSCREENSHOT = 44,
    kSKIN = 49,
    kTEAM = 50,
    kTORCH = 19,
    kUP = 2,
    kUSE = 40,
    kWPN_1 = 22,
    kWPN_2 = 23,
    kWPN_3 = 24,
    kWPN_4 = 25,
    kWPN_5 = 26,
    kWPN_6 = 27,
    kWPN_FIRE = 30,
    kWPN_FUNC = 35,
    kWPN_NEXT = 29,
    kWPN_RELOAD = 34,
    kWPN_ZOOM = 31,
	kWPN_FIREMODE_PREV = 36,
	kWPN_FIREMODE_NEXT = 37,
	//-- custom keybinds
	kCUSTOM1 = 67,
	kCUSTOM2 = 68,
	kCUSTOM3 = 69,
	kCUSTOM4 = 70,
	kCUSTOM5 = 71,
	kCUSTOM6 = 72,
	kCUSTOM7 = 73,
	kCUSTOM8 = 74,
	kCUSTOM9 = 75,
	kCUSTOM10 = 76,
	kCUSTOM11 = 77,
	kCUSTOM12 = 78,
	kCUSTOM13 = 79,
	kCUSTOM14 = 80,
	kCUSTOM15 = 81,
	kCUSTOM16 = 82,
	kCUSTOM17 = 83,
	kCUSTOM18 = 84,
	kCUSTOM19 = 85,
	kCUSTOM20 = 86,
	kCUSTOM21 = 87,
	kCUSTOM22 = 88,
	kCUSTOM23 = 89,
	kCUSTOM24 = 90,
	kCUSTOM25 = 91,
	kCAM_AUTOAIM = 82,
}

declare enum GAME_TYPE {
    GAME_UNKNOWN = -1,
    eGameIDDeathmatch = 2,
    eGameIDTeamDeathmatch = 4,
    eGameIDArtefactHunt = 8,
    eGameIDCaptureTheArtefact = 16,
}

declare enum game_difficulty {
    novice = 0,
    stalker = 1,
    veteran = 2,
    master = 3,
}

declare const enum EquipmentSlotId {
    Knife = 1,
    Weapon1 = 2,
    Weapon2 = 3,
    Grenade = 4,
    Binocular = 5,
    Bolt = 6,
    Outfit = 7,
    PDA = 8,
    Detector = 9,
    Torch = 10,
    Artefact = 11,
    Helmet = 12,
    Backpack = 13,
}