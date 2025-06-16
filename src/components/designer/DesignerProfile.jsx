import { useState } from "react";
import '../../styles/profile/DesignerProfile.css'

const demoUser = {
    name: "Linh Nguyen",
    avatar: "https://thietkewebchuyen.com/wp-content/uploads/logo-avatar-free-fire-cute-2.jpg",
    banner: "https://png.pngtree.com/thumb_back/fh260/background/20221011/pngtree-blue-gold-background-banner-idea-modern-simple-free-download-image_1467602.jpg",
    role: "Graphic Designer",
    location: "Hanoi, Vietnam",
    online: true,
    joined: "Joined Jan 2022",
    description:
        "Hi! I'm Linh, a passionate graphic designer with over 5 years of experience in logo, branding and UI/UX. Let's work together to make your vision come true!",
    stats: {
        completed: "98%",
        response: "1 Hour",
        delivered: "On Time",
        repeat: "21%"
    },
    gigs: [
        {
            id: 1,
            title: "I will design a professional modern logo",
            img: "/assets/demo-gig1.jpg",
            price: 50,
            rating: 5,
            sold: 120
        },
        {
            id: 2,
            title: "I will create outstanding brand guidelines",
            img: "/assets/demo-gig2.jpg",
            price: 70,
            rating: 4.9,
            sold: 80
        }
    ],
    reviews: [
        {
            id: 1,
            user: "Alice B.",
            avatar: "/assets/demo-ava1.jpg",
            rating: 5,
            text: "Amazing work! Fast, creative, and professional.",
            date: "Apr 2024"
        },
        {
            id: 2,
            user: "Tom K.",
            avatar: "/assets/demo-ava2.jpg",
            rating: 5,
            text: "Perfect branding guideline, will order again.",
            date: "Mar 2024"
        }
    ]
};

export default function DesignerProfile() {
    const [user] = useState(demoUser);

    return (
        <div className="profile-page bg-light pb-5">
            {/* Banner + avatar */}
            <div
                className="profile-banner"
                style={{
                    backgroundImage: `url(${user.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 240,
                    position: "relative"
                }}
            >
                <div
                    className="profile-avatar-box"
                    style={{
                        position: "absolute",
                        left: 40,
                        bottom: -50,
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <img
                        src={user.avatar}
                        alt="Avatar"
                        className="rounded-circle border border-4 border-white shadow"
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <div className="ms-4 d-none d-md-block">
                        <h2 className="fw-bold mb-1">{user.name}</h2>
                        <div className="text-muted mb-1">{user.role}</div>
                        <div className="d-flex align-items-center gap-3">
              <span className="me-2" style={{ color: "#1dbf73", fontWeight: 600 }}>
                {user.online ? "● Online" : "● Offline"}
              </span>
                            <span>
                <i className="bi bi-geo-alt-fill me-1"></i>
                                {user.location}
              </span>
                            <span className="text-muted">{user.joined}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container" style={{ marginTop: 70 }}>
                <div className="row">
                    {/* Main content */}
                    <div className="col-lg-8">
                        {/* Thông tin ngắn cho mobile */}
                        <div className="d-block d-md-none text-center mb-4 mt-2">
                            <h2 className="fw-bold mb-1">{user.name}</h2>
                            <div className="text-muted mb-1">{user.role}</div>
                            <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
                <span className="me-2" style={{ color: "#1dbf73", fontWeight: 600 }}>
                  {user.online ? "● Online" : "● Offline"}
                </span>
                                <span>
                  <i className="bi bi-geo-alt-fill me-1"></i>
                                    {user.location}
                </span>
                                <span className="text-muted">{user.joined}</span>
                            </div>
                        </div>
                        {/* Action */}
                        <div className="mb-4 d-flex gap-3">
                            <button className="btn btn-outline-secondary rounded-pill fw-semibold px-4">
                                Edit Profile
                            </button>
                            <button className="btn btn-success rounded-pill fw-semibold px-4">
                                Contact
                            </button>
                        </div>
                        {/* About */}
                        <div className="mb-4">
                            <h5 className="fw-bold mb-2">About</h5>
                            <p className="text-dark">{user.description}</p>
                        </div>
                        {/* Gigs/Portfolio */}
                        <div className="mb-4">
                            <h5 className="fw-bold mb-3">Gigs</h5>
                            <div className="row g-3">
                                {user.gigs.map((gig) => (
                                    <div className="col-md-6" key={gig.id}>
                                        <div className="card h-100 shadow-sm">
                                            <img
                                                src={gig.img}
                                                alt={gig.title}
                                                className="card-img-top"
                                                style={{ height: 140, objectFit: "cover" }}
                                            />
                                            <div className="card-body">
                                                <h6 className="card-title fw-semibold">{gig.title}</h6>
                                                <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-success me-2">
                            ★ {gig.rating}
                          </span>
                                                    <span className="text-muted">{gig.sold} sold</span>
                                                </div>
                                                <div>
                          <span className="fw-bold text-success">
                            ${gig.price}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Reviews */}
                        <div>
                            <h5 className="fw-bold mb-3">Reviews</h5>
                            <div>
                                {user.reviews.map((review) => (
                                    <div
                                        className="d-flex mb-4 border-bottom pb-3"
                                        key={review.id}
                                    >
                                        <img
                                            src={review.avatar}
                                            alt={review.user}
                                            className="rounded-circle me-3"
                                            width={48}
                                            height={48}
                                            style={{ objectFit: "cover" }}
                                        />
                                        <div>
                                            <div className="fw-semibold">{review.user}</div>
                                            <div className="mb-1 text-warning">
                                                {"★".repeat(Math.round(review.rating))}
                                                {"☆".repeat(5 - Math.round(review.rating))}
                                            </div>
                                            <div className="text-muted mb-1" style={{ fontSize: 14 }}>
                                                {review.date}
                                            </div>
                                            <div>{review.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Stats */}
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        <div className="card p-4 shadow-sm mb-4">
                            <h6 className="fw-bold mb-3">Profile Stats</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Orders Completed</span>
                                <span className="fw-semibold text-success">{user.stats.completed}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Response Time</span>
                                <span>{user.stats.response}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Delivered on Time</span>
                                <span>{user.stats.delivered}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Repeat Clients</span>
                                <span>{user.stats.repeat}</span>
                            </div>
                        </div>
                        {/* Thêm các phần sidebar khác nếu cần */}
                    </div>
                </div>
            </div>
        </div>
    );
}
