module.exports = {
    STATUS: {
        STATUS_SUCCESS: 0,
        STATUS_NOT_LOGIN: 1,
        STATUS_ROLE_ERROR: 2,
        STATUS_PARAM_ERROR: 3,
        STATUS_DATA_NOT_EXIST: 4,
        STATUS_CONVERT_ERROR: 5,
        STATUS_FAILURE: 9,
        STATUS_NO_RECORD: 8,
    },
    QUERY_KEYWORD: {
        NE: '$ne',
        PAGE: '_page',
        SIZE: '_size',
        SORT_FIELD: '_sort_field',
        SORT_TYPE: '_sort_type',
        SORT_MULTI: '_sort_multi',
        PROJECTION: '_projection',
        OBJECT_ID: '_id',
        ID: 'id',
        DELETE_FLAG: 'deleteFlag',
        SLUG: 'slug',
        NOT_EQUAL: '$ne',
        TEXT: '$text',
        SEARCH: '$search',
        OR: '$or',
        REGEX: '$regex',
        OPTIONS: '$options',
        ROLE: 'role',
        MATCH: '$match',
        LIMIT: '$limit',
        SORT: '$sort',
        SAMPLE: '$sample',
        SAMPLE_SIZE: 'size',
        PROJECT: '$project',
        UPDATE_TIME: 'updateTime',
        $_SET_INTERSECTION: '$setIntersection',
        $_SIZE: '$size',
        NUMBER_OF_MATCHES: 'numberOfMatches',
        ALL: '$all',
        SCORE: 'score',
        META: '$meta',
        TEXT_SCORE: 'textScore',
        PUSH: '$push',
        ADD_TO_SET: '$addToSet',
        PULL: '$pull',
    },
    PAGING: {
        STATUS_LIST: 10,
        TEAM_LIST: 20,
        USER_LIST: 20,
        FEEDBACK_LIST: 20,
        STADIUM_LIST: 18,
        REPLY_LIST: 10,
        MENTION_LIST: 5,
        FAIR_LIST: 20
    },
    DATE_TIME: {
        YYYYMMDD: "YYYYMMDD"
    },
    DAY_NAME: {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    },
    STADIUM_PRICE: {
        1: "s5Price",
        2: "s7Price",
        3: "s9Price"
    }
}