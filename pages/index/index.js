Page({
    data: {
        showMask: false,
        list: []
    },
    onLoad: function() {
        this.setData({
            list: [{
                    id: '1',
                    content: 'test1'
                },
                {
                    id: '2',
                    content: 'test2'
                },
                {
                    id: '3',
                    content: 'test3'
                },
                {
                    id: '4',
                    content: 'test4'
                },
                {
                    id: '5',
                    content: 'test5'
                },
                {
                    id: '6',
                    content: 'test6'
                },
                {
                    id: '7',
                    content: 'test7'
                },
                {
                    id: '8',
                    content: 'test8'
                },
                {
                    id: '9',
                    content: 'test9'
                },
                {
                    id: '10',
                    content: 'test10'
                }
            ]
        })
    }
})