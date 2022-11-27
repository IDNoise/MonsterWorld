import { GetBonusDescription, StatType } from "../Configs/Stats";
import { MWItem } from './MWItem';
import { ObjectType } from "./MWObject";

export class MWArtefact extends MWItem {

    get Type(): ObjectType { return ObjectType.Artefact }

    get Description(): string{
        let result = "";

        let DescriptionStats: StatType[] = [
        ];

        for(const stat of DescriptionStats){
            let asPct = false;
            let value = this.GetStat(stat);

            if (value != 0)
                result += GetBonusDescription(stat, value, asPct) + " \\n";
        }

        return result;
    }

    override GenerateStats(): void {
        super.GenerateStats();
    }
}