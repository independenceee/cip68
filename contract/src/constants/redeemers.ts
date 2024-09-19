const redeemers = {
    mint: {
        data: {
            alternative: 0,
            fields: []
        },
        tag: 'MINT'
    },
    burn: {
        data: {
            alternative: 1,
            fields: []
        }
    },
    update: {
        data: {
            alternative: 0,
            feilds: []
        }
    },
    remove: {
        data: {
            alternative: 1,
            feilds: []
        }
    }
} as const

export default redeemers
