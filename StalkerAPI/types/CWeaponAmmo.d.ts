
declare interface CWeaponAmmo extends CGameObject {
	m_boxCurr: number;
	m_boxSize: number;
	m_tracer: boolean;
	m_4to1_tracer: boolean;

	Cost(): number;
	Weight(): number;
}
