import type { AssignedUnitPopulated } from "./AssigneUnit.model";
import type { BaseModel } from "./BaseModel";
import type { Unit } from "./Unit.model";

export interface Notice extends BaseModel{
  id: number;
  title: string;
  content: string;
  target_audience: Unit[];
  notice_type: {id:number, name: string}
}


export interface NoticeDetail extends BaseModel{
  id: number;
  title: string;
  content: string;
  target_audience: AssignedUnitPopulated[];
  notice_type: {id:number, name: string}
}
