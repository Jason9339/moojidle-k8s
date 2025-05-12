

const DiscussionBoardContent = () => {


    return (

        <div className="flex h-screen">

            <div className="h-full">

                <h2>課程討論版</h2>


            </div>
            <div className="flex flex-col w-[10vw] mt:[5vh] h-full">
                <button className="w-full bg-[#9D9D9D] hover:bg-[#6C6C6C] text-center" onClick={() => { alert("new post") }}>
                    新增貼文
                </button>
            </div>


        </div>

    )
}


export default DiscussionBoardContent;
