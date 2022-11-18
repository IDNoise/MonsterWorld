type BoneId = number;

/** @customConstructor hit */
declare class hit {
  constructor(otherHit?: hit);

  direction: vector;
  draftsman: game_object;
  impulse: number;
  power: number;
  type: HitType;
  weapon_id: number;

  bone(boneName: string): void;
}
