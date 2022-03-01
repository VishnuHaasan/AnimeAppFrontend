import config from "../config"

const Player = (props) => {
    const ep = parseInt(props.ep) 
    console.log(props)
    const url = `${config.VideoServer}/video/${props.entity.slug}/${props.entity.episodes[ep-1].episode_url}`
    const subUrl = `${config.VideoServer}/captions/${props.entity.slug}/${props.entity.episodes[ep-1].episode_url.split(".")[0]}.vtt`
    console.log(props.entity)
    return(
        <div className="mx-auto w-3/5 border-cyan-500 border-4 shadow-lg shadow-cyan-500/90">
            <video width="100%" height="auto" id={props.entity.id} crossOrigin="anonymous" controls>
                <source src={url} type="video/mp4"/>
                <track label="English" kind="subtitles" srcLang="en" src={subUrl} default></track>
            </video>
        </div>        
    )
}

export default Player