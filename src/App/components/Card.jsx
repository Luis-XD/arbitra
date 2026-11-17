import { Link } from "react-router-dom"
import styles from "./css/Card.module.css"
import bannerDefaultCard from '/logo.png'
import { CONFIG_BACKEND } from "../config/config"
import CircleProgress from "./CircleProgress"

function Card({link, cardTitle="", ubication="", imgCard="", imgSrc="", data=""}) {
    let imgSrcAbsolute=""
    let routeImg = CONFIG_BACKEND.API_DIR+"/src/assets/"+ubication+"/"+imgCard

    if(imgCard){
        imgSrcAbsolute = routeImg
    }else if (imgSrc){
        imgSrcAbsolute = imgSrc
    }

    // Detectamos si 'data' viene como objeto o directamente como el número de porcentaje
    const percentageValue = typeof data === 'object' ? (data.percentage || 0) : (Number(data) || 0);

    return ( 
        <>
            <div className={styles.contCard} style={{position:'relative'}}>
                {data !== "" && <CircleProgress percentage={percentageValue}/>}
                <Link to={link}>
                    <div className={styles.card}>
                        <img src={!imgCard ? bannerDefaultCard : imgSrcAbsolute}/>
                        <div className={styles.cardContent}>
                            {cardTitle && (
                                <h2 className={styles.cardTitle}>{cardTitle}</h2>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </>
     )
}

export default Card