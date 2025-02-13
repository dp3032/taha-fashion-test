import { FaInstagram } from 'react-icons/fa'; 

function Instagram() {
    return (
        <>
            <section className="instagram spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 insgrmpost">
                            <div className="instagram__pic">
                                <div className="instagram__pic__item set-bg">
                                    <a href="https://www.instagram.com/tahafashionofficial/">
                                        <img src="img/instagram/instgram-post-1.jpg" alt="Loading..." />
                                        <div className="overlay">
                                            <FaInstagram size={30} color="#000" /> 
                                        </div>
                                    </a>
                                </div>
                                <div className="instagram__pic__item set-bg">
                                    <a href="https://www.instagram.com/tahafashionofficial/">
                                        <img src="img/instagram/instgram-post-2.jpg" alt="Loading..." />
                                        <div className="overlay">
                                            <FaInstagram size={30} color="#000" /> 
                                        </div>
                                    </a>
                                </div>
                                <div className="instagram__pic__item set-bg">
                                    <a href="https://www.instagram.com/tahafashionofficial/">
                                        <img src="img/instagram/instgram-post-3.jpg" alt="Loading..." />
                                        <div className="overlay">
                                            <FaInstagram size={30} color="#000" /> 
                                        </div>
                                    </a>
                                </div>
                                <div className="instagram__pic__item set-bg">
                                    <a href="https://www.instagram.com/tahafashionofficial/">
                                        <img src="img/instagram/instgram-post-7.jpg" alt="Loading..." />
                                        <div className="overlay">
                                            <FaInstagram size={30} color="#000" /> 
                                        </div>
                                    </a>
                                </div>
                                <div className="instagram__pic__item set-bg">
                                    <a href="https://www.instagram.com/tahafashionofficial/">
                                        <img src="img/instagram/instgram-post-8.jpg" alt="Loading..." />
                                        <div className="overlay">
                                            <FaInstagram size={30} color="#000" /> 
                                        </div>
                                    </a>
                                </div>
                                <div className="instagram__pic__item set-bg">
                                    <a href="https://www.instagram.com/tahafashionofficial/">
                                        <img src="img/instagram/instgram-post-6.jpg" alt="Loading..." />
                                        <div className="overlay">
                                            <FaInstagram size={30} color="#000" /> 
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="instagram__text">
                                <h2>Instagram</h2>
                                <h4 className="somemrg">TAHA FASHION STUDIO</h4>
                                <p>Elvating Tradition with Contemporary Elegance | Discover Exquisite Wedding Ensembles at Taha Fashion Studio | Let Us Tailor Your Love Story</p>
                                <a href="https://www.instagram.com/tahafashionofficial/">
                                    <h3 className="txting">#tahafashion</h3>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Instagram;
