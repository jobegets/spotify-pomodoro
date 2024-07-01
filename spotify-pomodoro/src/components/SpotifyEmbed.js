import {useContext} from "react";
import EmbedContext from "../EmbedContext";

const SpotifyEmbed = () => {
    const embedContext = useContext(EmbedContext);
    console.log(embedContext.embed);
    // make this component at the very bottom of the page
    return (
        <div class = "fixed bottom-0 w-full pl-10 pr-10 m-0">
            <iframe src = {embedContext.embed} width="100%" height="200px"frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
    );

}

export default SpotifyEmbed;