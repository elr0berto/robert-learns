import {apiClient} from './ApiClient';
import CardSet from "./models/CardSet";
import {CardSetCardListResponse} from "./models/CardSetCardListResponse";

export const cardSetCardList = async(cardSet : CardSet) : Promise<CardSetCardListResponse> => {
    return await apiClient.get(CardSetCardListResponse, '/card-sets/'+cardSet.id+'/cards/');
}
