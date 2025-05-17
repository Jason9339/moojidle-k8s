import React, { useState } from 'react';
import styles from "./OverviewPostCard.module.css"

const OverviewPostCard = ({ userPfp, courseName, boardName, userName, userTags, title, content, postDate, onClick }) => {
    const [imgSrc, setImgSrc] = useState(userPfp || "/user_pfp/default.png");

    let test = `A good example of a paragraph is: "The bustling streets of 北投區 teem with activity. From the vibrant stalls offering fresh produce to the lively cafes serving local delicacies, the area pulsates with energy. Ancient temples stand as silent guardians of the past, while modern buildings reflect the area's vibrant present." This paragraph uses vivid language and imagery to paint a picture of the area, effectively conveying its character and atmosphere.
    A more detailed explanation of what makes a paragraph effective:
    Topic Sentence:
    The first sentence, "The bustling streets of 北投區 teem with activity," introduces the main idea of the paragraph and sets the tone for what follows.
    Supporting Details:
    The next sentences provide more specific details about the area's activities, from the stalls to the cafes, creating a more vivid and engaging description.
    Concluding Sentence:
    The final sentence, "Ancient temples stand as silent guardians of the past, while modern buildings reflect the area's vibrant present," provides a summary and reinforces the paragraph's main idea, helping the reader to understand the overall theme of the area.
    Flow and Coherence:
    The sentences flow logically together, creating a cohesive and engaging reading experience. The use of transition words and phrases (e.g., "from," "to," "while") further enhances the flow.`;

    test = `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;

    test = test.substring(0, 400).concat("....");

    return (
        <>
            <div className={styles["card"]} onClick={onClick}>
                <div className={styles["padder-each-block"]}>
                    <p className={styles["course-name"]}>{courseName} &gt; </p> <p className={styles["board-name"]}>{boardName}</p>
                </div>
                <div className={styles["name-tag-pfp-flex-box"]}>
                    <img
                        src={imgSrc}
                        onError={() => setImgSrc("/user_pfp/default.png")}
                        className={styles["user-pfp"]}
                        alt="profile"
                    />
                    <div className={styles["name-tag-flex-box"]}>
                        <p className={styles["user-name"]}>{userName}</p>
                        <div>
                            {userTags && userTags.length > 0 ? (
                                userTags.map((userTag, index) => (
                                    <p className={styles["user-tag"]} key={index}>
                                        {userTag.tag_name}
                                    </p>
                                ))
                            ) : (
                                <p className={styles["user-tag"]}>No specific tags</p>
                            )}
                        </div>
                    </div>
                </div>
                <hr className={styles["seperate-line"]} />
                <div className={styles["padder-each-block"]}>
                    <p className={styles["title"]}>
                        {title}
                    </p>
                </div>
                <div className={styles["padder-content-block"]}>
                    <textarea className={styles["content"]} readOnly>
                        {content}
                        {/* {test} */}
                    </textarea>
                </div>
                <div className={styles["post-date"]}>
                    {postDate.substring(0, 10)}
                </div>
            </div>
        </>
    )
}


export default OverviewPostCard;
