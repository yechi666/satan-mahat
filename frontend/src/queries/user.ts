import gql from "graphql-tag";

export const getUserRoleByPersonalNumber = gql
    `query ($soldier_id: Int!){
    core_users_roles(where:{user:{soldier_id:{_eq:$soldier_id}}}
    order_by:{id:desc}
    limit:1){
role_id
}}`;


export default {
    getUserRoleByPersonalNumber
}