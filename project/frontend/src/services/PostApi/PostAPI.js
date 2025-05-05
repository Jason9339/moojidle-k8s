import apiClient from "@/services/apiClient";

async function getPostContentFake(postID) {
    // const response = await apiClient.get(``)
    const fake_data = [
        {   post_id: "1", 
            post_by_user_id: "葉宇瀚",
            title: "Post title 1 in Board 1",
            description: "第一行\n第二行",
            post_date: "2022-05-06T01:09:56.000+00:00",
            public: "true",
            in_b_id: "電腦圖學",
            post_tags: [
                {tag_id: "26", tag_name: "Tag_82"},
                {tag_id: "27", tag_name: "Tag_825"},
            ],
            comments: [
                {
                    comment_id :"222",
                    comment_by_user_id : "12",
                    comment_user_custom_tag : "CustomTag_20",
                    comment_date : "2023-05-14T14:47:46.000+00:00",
                    description : "This is a comment on post 4."
                },
                {
                    comment_id :"223",
                    comment_by_user_id : "14",
                    comment_user_custom_tag : "CustomTag_21",
                    comment_date : "2023-05-15T14:47:45.000+00:00",
                    description : "This is a comment"
                },
            ]
        }
    ];
    const response = {
        data: fake_data,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
    };

    return response.data;
}

export { getPostContentFake};
