declare namespace CActorCondition{
    const eBoostBleedingRestore = 3
	const eBoostBurnImmunity = 8
	const eBoostChemicalBurnImmunity = 12
	const eBoostChemicalBurnProtection = 7
	const eBoostExplImmunity = 13
	const eBoostFireWoundImmunity = 15
	const eBoostHpRestore = 0
	const eBoostMaxWeight = 4
	const eBoostPowerRestore = 1
	const eBoostRadiationImmunity = 10
	const eBoostRadiationProtection = 5
	const eBoostRadiationRestore = 2
	const eBoostShockImmunity = 9
	const eBoostStrikeImmunity = 14
	const eBoostTelepaticImmunity = 11
	const eBoostTelepaticProtection = 6
	const eBoostWoundImmunity = 16
	const eCantWalkWeight = 128
	const eCantWalkWeightReached = 256
	const eCriticalBleedingSpeed = 4
	const eCriticalPowerReached = 1
	const eCriticalRadiationReached = 16
	const eCriticalSatietyReached = 8
	const ePhyHealthMinReached = 64
	const eWeaponJammedReached = 32
}


declare interface CActorCondition {// extends CEntityCondition 
	// property m_condition_flags
	// property m_fAccelK
	// property m_fJumpPower
	// property m_fJumpWeightPower
	// property m_fOverweightJumpK
	// property m_fOverweightWalkK
	// property m_fSprintK
	// property m_fStandPower
	// property m_fWalkWeightPower
	// property m_MaxWalkWeight

	// function ApplyBooster(CActorCondition*, const SBooster&, string)
	// function BleedingSpeed()
	// function BoostBleedingRestore(number)
	// function BoostBurnImmunity(number)
	// function BoostChemicalBurnImmunity(number)
	// function BoostChemicalBurnProtection(number)
	// function BoosterForEach(CActorCondition*, const function<boolean>&)
	// function BoostExplImmunity(number)
	// function BoostFireWoundImmunity(number)
	// function BoostHpRestore(number)
	// function BoostMaxWeight(number)
	// function BoostPowerRestore(number)
	// function BoostRadiationImmunity(number)
	// function BoostRadiationProtection(number)
	// function BoostRadiationRestore(number)
	// function BoostShockImmunity(number)
	// function BoostStrikeImmunity(number)
	// function BoostTelepaticImmunity(number)
	// function BoostTelepaticProtection(number)
	// function BoostWoundImmunity(number)
	// function ChangeAlcohol(number)
	// function ChangeBleeding(number)
	// function ChangeEntityMorale(number)
	// function ChangeHealth(number)
	// function ChangePower(number)
	// function ChangePsyHealth(number)
	// function ChangeRadiation(number)
	// function ChangeSatiety(number)
	// function GetEntityMorale() const
	// function GetHealthLost() const
	// function GetMaxPower() const
	// function GetPower() const
	// function GetPsyHealth() const
	// function GetRadiation() const
	// function GetSatiety() const
	// function GetSatiety()
	// function GetWhoHitLastTimeID()
	// function IsCantSprint() const
	// function IsCantWalk() const
	// function IsCantWalkWeight()
	// function IsLimping() const
	// function SatietyCritical()
	// function SetMaxPower(number)
	// function V_Satiety()
	// function V_SatietyHealth()
	// function V_SatietyPower()
}