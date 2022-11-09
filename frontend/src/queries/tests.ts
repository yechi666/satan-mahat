import gql from 'graphql-tag';

const TEST_TAGS = [2, 3];

export const getTestsByRoot = gql`
  query($root_id: Int!) {
    eval_milestones(where: { parent: { _eq: $root_id } }) {
      name
      children {
        name
      }
    }
  }
`;
export const getRootByMegama = gql`
  query($megama_id: Int!) {
    api_all_tree_roots(
      where: {
        group: {
          parent_id: { _eq: $megama_id }
          _and: { children: { end_date: { _gt: "now()" } } }
        }
      }
    ) {
      id
      name
    }
  }
`;
export const getMegamaByPersonalNumber = gql`
  query($soldier_id: Int!) {
    userDetailsBySoldierId: api_all_users(where: { soldier_id: { _eq: $soldier_id } }) {
      user_id
      assignments(where: { course: { end_date: { _gte: "now()" } } }) {
        user_role_id
        role_name
        role_id
        course {
          name
          id
        }
        department_or_team_id
        group_name
        cycle_id
        megama_id
      }
    }
  }
`;

export const getTestNames = gql`
	query($root_id: Int!) {
		testList: eval_milestones(
			where: {
				root: { root: { root: { root: { id: { _eq: $root_id } } } } }
				_and: [
        {	milestones_tags: { tag: { id: { _in: [${TEST_TAGS}] } } }	}
        ]
			}
		) {
			name
			 parent_milestone {
        name
      }
		}
	}
`;

export default {
  getTestsByRoot,
  getRootByMegama,
  getMegamaByPersonalNumber,
  getTestNames,
};
