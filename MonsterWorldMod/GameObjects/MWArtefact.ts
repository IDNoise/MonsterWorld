import { GetBonusDescription, StatType } from "../Configs/Stats";
import { MWItem } from './MWItem';
import { ObjectType } from "./MWObject";

export class MWArtefact extends MWItem {

    get Type(): ObjectType { return ObjectType.Artefact }

    get Description(): string{
        let result = "";

        return result;
    }

    override GenerateStats(): void {
        super.GenerateStats();
    }

    protected override SetupSkills(): void {
        super.SetupSkills();
        switch(this.Section){
            
        }        
    }
}

