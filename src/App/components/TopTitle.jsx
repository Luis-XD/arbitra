import styles from './css/TopTitle.module.css'

function TopTitle() {
    return ( 
        <div className={styles.formationTop}>
          <div>
            <div className="eyebrow">Oferta formativa</div>
            <h2 id="formTitle">
              Nuestras <span className="green">formaciones</span>
            </h2>
          </div>
          <p>
            Explorá las especialidades de arbitraje vinculadas al fútbol.
            Consultá los programas, requisitos y próximas fechas de cursada.
          </p>
        </div>
     );
}

export default TopTitle;