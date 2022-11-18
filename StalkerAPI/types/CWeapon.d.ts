declare namespace CWeapon{
    const eFire = 0
	const eFire2 = 1
	const eReload = 2
	const eMisfire = 3
	const eMagEmpty = 4
	const eSwitch = 5
	const eSwitchMode = 6

    const eSubstateReloadBegin = 0
	const eSubstateReloadInProcess = 1
	const eSubstateReloadEnd = 2
}

declare interface CWeapon extends CGameObject {
	can_kill(): boolean;
	IsGrenadeLauncherAttached(): boolean;
	GrenadeLauncherAttachable(): boolean;
	GetGrenadeLauncherName(): string;
	IsScopeAttached(): boolean;
	ScopeAttachable(): boolean;
	GetScopeName(): string;
	IsSilencerAttached(): boolean;
	SilencerAttachable(): boolean;
	GetSilencerName(): string;
	IsZoomEnabled(): boolean;
	IsZoomed(): boolean;
	GetZoomFactor(): number;
	SetZoomFactor(factor: number): void;
	IsSingleHanded(): boolean;
	GetBaseDispersion(val: number): number; //TODO
	GetFireDispersion(): number;
	GetMisfireStartCondition(): number;
	GetMisfireEndCondition(): number;
	GetAmmoElapsed(): number;
	GetAmmoMagSize(): number;
	GetSuitableAmmoTotal(): number;
	SetAmmoElapsed(ammo: number): void;
	//SwitchAmmoType(number): void;
	GetMagazineWeight(): number;
	GetAmmoCount_forType(ammoType: string): number;
	//set_ef_main_weapon_type(number)
	//set_ef_weapon_type(number)
	//SetAmmoType(number)
	//GetAmmoType()
	//AmmoTypeForEach(functor)
	RPM(): number;
	ModeRPM(): number; //TODO
	Get_PDM_Base(): number;
	Get_Silencer_PDM_Base(): number;
	Get_Scope_PDM_Base(): number;
	Get_Launcher_PDM_Base(): number;
	Get_PDM_BuckShot(): number;
	Get_PDM_Vel_F(): number;
	Get_Silencer_PDM_Vel(): number;
	Get_Scope_PDM_Vel(): number;
	Get_Launcher_PDM_Vel(): number;
	Get_PDM_Accel_F(): number;
	Get_Silencer_PDM_Accel(): number;
	Get_Scope_PDM_Accel(): number;
	Get_Launcher_PDM_Accel(): number;
	Get_PDM_Crouch(): number;
	Get_PDM_Crouch_NA(): number;
	GetCrosshairInertion(): number;
	Get_Silencer_CrosshairInertion(): number;
	Get_Scope_CrosshairInertion(): number;
	Get_Launcher_CrosshairInertion(): number;
	GetFirstBulletDisp(): number;
	GetHitPower(): number;
	GetHitPowerCritical(): number;
	GetHitImpulse(): number;
	GetFireDistance(): number;
	GetInertionAimFactor(): number;
	Cost(): number;
	Weight(): number;
}