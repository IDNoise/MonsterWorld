declare interface CALifeMonsterBrain {
    can_choose_alife_tasks(value: boolean):  void;
    update(): void;
    //movement(const CALifeMonsterBrain*) //TODO - WTF?
}

declare interface CALifeHumanBrain extends CALifeMonsterBrain {}

