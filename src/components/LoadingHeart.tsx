

interface propsInterface {
    stateLoading: boolean,
}


export default function LoadingHeart(props: propsInterface) {

    if (!props.stateLoading) return null
    return (
        <>
            <div style={{
                zIndex: 90
            }} className={`absolute wh-full flex-center`}>
                <div className="absolute top-0 left-0 wh-full opacity-40 blur-loading"></div>
                <div className="loading-heart"><div></div></div>
            </div>
        </>
    )

}