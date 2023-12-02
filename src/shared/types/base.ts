import {IconCollectionType} from "shared/components/icon/icon-list";

export interface ILink {
    icon: IconCollectionType
    title: string,
    path: string,
    available?: boolean
}
