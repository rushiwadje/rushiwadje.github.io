document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SYSTEM LOADER CURTAIN EXIT
       ========================================================================== */
    const loader = document.getElementById('loader');
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Loader entrance simulation and fadeout
    setTimeout(() => {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, 1500);


    /* ==========================================================================
       2. SCROLL REVEAL & NAVIGATION SCROLL OBSERVER
       ========================================================================== */
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');

    // Dynamically apply scroll-reveal class to sections for smooth entrance
    sections.forEach((section, index) => {
        if (index > 0) { // Keep hero immediately visible
            section.classList.add('scroll-reveal');
        }
    });

    // Observer options for scroll reveal
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    sections.forEach(section => {
        if (section.classList.contains('scroll-reveal')) {
            revealObserver.observe(section);
        }
    });

    // Observer options for active nav indicators
    const navOptions = {
        threshold: 0.35,
        rootMargin: '-72px 0px -40% 0px'
    };

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href').substring(1);
                    if (href === activeId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Mobile nav toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================================================
       3. AMBIENT SCHEMATIC FLOW CANVAS ANIMATION
       ========================================================================== */
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Define a schematic network structure (Warehouses, Hubs, Transit Lines)
        const hubs = [];
        const lines = [];
        const packages = [];

        // Generate 6 fixed hub locations based on screen sizes with supply chain roles
        const generateHubs = () => {
            hubs.length = 0;
            const points = [
                { x: 0.12, y: 0.25, label: 'MFG-01', type: 'FACTORY' },
                { x: 0.88, y: 0.18, label: 'PORT-02', type: 'SEAPORT' },
                { x: 0.5, y: 0.45, label: 'HUB-03', type: 'CENTRAL HUB' },
                { x: 0.2, y: 0.75, label: 'WH-04', type: 'WAREHOUSE' },
                { x: 0.78, y: 0.82, label: 'DC-05', type: 'DIST CENTER' },
                { x: 0.48, y: 0.88, label: 'TERM-06', type: 'TERMINAL' }
            ];

            points.forEach((pt, i) => {
                hubs.push({
                    id: i,
                    x: pt.x * width,
                    y: pt.y * height,
                    r: i === 2 ? 6 : 4,
                    label: pt.label,
                    type: pt.type
                });
            });
        };

        // Connect hubs with transit routes
        const generateRoutes = () => {
            lines.length = 0;
            const connections = [
                [0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [0, 3], [1, 4]
            ];
            connections.forEach(conn => {
                const start = hubs[conn[0]];
                const end = hubs[conn[1]];
                if (start && end) {
                    lines.push({ start, end });
                }
            });
        };

        // Create initial slow packages (cargo) flowing on networks
        const generatePackages = () => {
            packages.length = 0;
            for (let i = 0; i < 20; i++) {
                const line = lines[Math.floor(Math.random() * lines.length)];
                if (line) {
                    packages.push({
                        line: line,
                        progress: Math.random(),
                        speed: 0.0004 + Math.random() * 0.0008, // slow movement
                        type: Math.random() > 0.5 ? 'truck' : 'container'
                    });
                }
            }
        };

        const initAnimation = () => {
            generateHubs();
            generateRoutes();
            generatePackages();
        };

        initAnimation();
        window.addEventListener('resize', initAnimation);

        // Slow rendering loop
        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw transit lines and faint route labels
            lines.forEach((line, index) => {
                ctx.strokeStyle = 'rgba(74, 105, 132, 0.08)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(line.start.x, line.start.y);
                ctx.lineTo(line.end.x, line.end.y);
                ctx.stroke();

                // Draw faint label along the routes
                if (index % 2 === 0) {
                    const midX = (line.start.x + line.end.x) / 2;
                    const midY = (line.start.y + line.end.y) / 2;
                    ctx.save();
                    ctx.translate(midX, midY);
                    const angle = Math.atan2(line.end.y - line.start.y, line.end.x - line.start.x);
                    ctx.rotate(angle);
                    ctx.fillStyle = 'rgba(74, 105, 132, 0.12)';
                    ctx.font = '8px monospace';
                    ctx.fillText(`ROUTE-0${index+1}`, -20, -4);
                    ctx.restore();
                }
            });

            // Draw hubs (squares with corners + text labels)
            hubs.forEach(hub => {
                // Pulsing glow ring
                const pulse = 1 + Math.sin(Date.now() * 0.003 + hub.id) * 0.2;
                ctx.strokeStyle = 'rgba(74, 105, 132, 0.06)';
                ctx.beginPath();
                ctx.arc(hub.x, hub.y, (hub.r + 5) * pulse, 0, Math.PI * 2);
                ctx.stroke();

                // Outer square boundary
                ctx.fillStyle = 'rgba(250, 250, 248, 0.9)';
                ctx.strokeStyle = 'rgba(74, 105, 132, 0.25)';
                ctx.lineWidth = 1;
                ctx.fillRect(hub.x - 5, hub.y - 5, 10, 10);
                ctx.strokeRect(hub.x - 5, hub.y - 5, 10, 10);

                // Central node dot
                ctx.fillStyle = 'rgba(74, 105, 132, 0.6)';
                ctx.fillRect(hub.x - 2, hub.y - 2, 4, 4);

                // Text labels: Code and Role
                ctx.fillStyle = 'rgba(13, 13, 13, 0.55)';
                ctx.font = 'bold 9px var(--font-head)';
                ctx.fillText(hub.label, hub.x + 10, hub.y - 2);

                ctx.fillStyle = 'rgba(74, 105, 132, 0.45)';
                ctx.font = '7px var(--font-body)';
                ctx.fillText(hub.type, hub.x + 10, hub.y + 6);
            });

            // Draw cargo units flowing along routes (drawn as rectangular top-down containers/trucks)
            packages.forEach(pkg => {
                pkg.progress += pkg.speed;
                if (pkg.progress >= 1) {
                    pkg.progress = 0;
                    pkg.line = lines[Math.floor(Math.random() * lines.length)];
                }

                if (pkg.line) {
                    const x = pkg.line.start.x + (pkg.line.end.x - pkg.line.start.x) * pkg.progress;
                    const y = pkg.line.start.y + (pkg.line.end.y - pkg.line.start.y) * pkg.progress;

                    // Calculate rotation angle
                    const dx = pkg.line.end.x - pkg.line.start.x;
                    const dy = pkg.line.end.y - pkg.line.start.y;
                    const angle = Math.atan2(dy, dx);

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);

                    if (pkg.type === 'truck') {
                        // Cabin (front)
                        ctx.fillStyle = 'rgba(74, 105, 132, 0.55)';
                        ctx.fillRect(4, -1.5, 2, 3);
                        
                        // Trailer container
                        ctx.fillStyle = 'rgba(74, 105, 132, 0.22)';
                        ctx.strokeStyle = 'rgba(74, 105, 132, 0.45)';
                        ctx.lineWidth = 0.85;
                        ctx.fillRect(-6, -2.5, 9, 5);
                        ctx.strokeRect(-6, -2.5, 9, 5);

                        // Rib marks on container
                        ctx.strokeStyle = 'rgba(250, 250, 248, 0.4)';
                        ctx.beginPath();
                        ctx.moveTo(-3, -2.5); ctx.lineTo(-3, 2.5);
                        ctx.moveTo(0, -2.5); ctx.lineTo(0, 2.5);
                        ctx.stroke();
                    } else {
                        // Standard cargo container unit
                        ctx.fillStyle = 'rgba(74, 105, 132, 0.22)';
                        ctx.strokeStyle = 'rgba(74, 105, 132, 0.45)';
                        ctx.lineWidth = 0.85;
                        ctx.fillRect(-5, -2.5, 10, 5);
                        ctx.strokeRect(-5, -2.5, 10, 5);

                        // Rib marks on container
                        ctx.strokeStyle = 'rgba(250, 250, 248, 0.4)';
                        ctx.beginPath();
                        ctx.moveTo(-2, -2.5); ctx.lineTo(-2, 2.5);
                        ctx.moveTo(1, -2.5); ctx.lineTo(1, 2.5);
                        ctx.stroke();
                    }

                    ctx.restore();
                }
            });

            requestAnimationFrame(draw);
        };

        draw();
    }


    /* ==========================================================================
       4. INTERACTIVE CAPABILITIES NODE MAP WIDGET
       ========================================================================== */
    const capabilitiesData = {
        sc: {
            title: "Supply Chain Management",
            desc: "Designing, tracking, and optimizing network flows. Hands-on experience with SKU sizing (3000+ variants), pick routing, inventory management, and WMS software integration in high-throughput settings.",
            skills: [
                "WMS Integration",
                "Network Routing",
                "SKU Sizing & Audits"
            ]
        },
        ops: {
            title: "Operations & Process Design",
            desc: "Mapping operations from raw materials to final packaging. Practical experience in workshop workflow drafting, plant-to-plant transport operations, and warehouse simulation modeling using AnyLogic.",
            skills: [
                "Workflow Modeling",
                "Shop-Floor Transitions",
                "SOP Development"
            ]
        },
        analytics: {
            title: "Business & SCM Analytics",
            desc: "Translating transactional datasets into operational levers. Sourcing spend audits, customer SLA compliance monitoring, ABC-Pareto prioritization, and visual management dashboard scripting.",
            skills: [
                "Spend Auditing",
                "SLA Compliance Tracking",
                "Excel KPI Dashboards"
            ]
        },
        strategy: {
            title: "Sourcing & Strategy",
            desc: "Leveraging data for strategic cost control. Developing negotiation frameworks, evaluating bulk sifting limits, vendor contract consolidation guidelines, and analyzing logistical networks.",
            skills: [
                "Vendor Management",
                "Cost-Benefit Analysis",
                "Geopolitical SCM Analysis"
            ]
        },
        leadership: {
            title: "Leadership & Coordination",
            desc: "Structuring cross-functional teams for execution ownership. Experienced in managing budgets exceeding ₹1,00,000 as Treasurer and coordinating large sponsorship acquisitions of ₹2,00,000+ for academic festivals and exhibitions at NIT Calicut.",
            skills: [
                "Budget Management",
                "Stakeholder Coordination",
                "Cross-Functional Team Management"
            ]
        }
    };

    const capNodes = document.querySelectorAll('.map-node');
    const capCardTitle = document.getElementById('cap-card-title');
    const capCardDesc = document.getElementById('cap-card-desc');
    const capCardList = document.getElementById('cap-card-list');
    const capCardContainer = document.getElementById('capability-detail-card');

    if (capNodes.length && capCardTitle && capCardDesc && capCardList) {
        capNodes.forEach(node => {
            node.addEventListener('click', () => {
                // Clear active states
                capNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');

                const key = node.getAttribute('data-cap');
                const data = capabilitiesData[key];
                if (data) {
                    // Trigger dynamic fade entry
                    if (capCardContainer) {
                        capCardContainer.style.opacity = '0';
                        capCardContainer.style.transform = 'translateY(10px)';
                        
                        setTimeout(() => {
                            capCardTitle.textContent = data.title;
                            capCardDesc.textContent = data.desc;
                            
                            // Rebuild list
                            capCardList.innerHTML = '';
                            data.skills.forEach(skill => {
                                const li = document.createElement('li');
                                li.textContent = skill;
                                capCardList.appendChild(li);
                            });
                            
                            capCardContainer.style.opacity = '1';
                            capCardContainer.style.transform = 'translateY(0)';
                            capCardContainer.style.transition = 'all 0.4s ease';
                        }, 200);
                    }
                }
            });
        });
    }


    /* ==========================================================================
       5. DYNAMIC CASE STUDY DRAWER SYSTEM
       ========================================================================== */
    const caseStudiesData = [
        {
            title: "DataCo Global Performance Analysis",
            eyebrow: "Case Study 1 • Business Optimization",
            summary: "Performance audit of a massive transaction database containing 180,519 records to identify SLA breaches and margin leakages.",
            method: "Descriptive Statistics & Business Intel",
            tools: "Excel Pivot Tables / Data Validation",
            timeline: "3 Weeks",
            context: "<h3>Context</h3><p>DataCo Global, a major supply chain logistics provider, experienced significant distribution bottlenecks and high shipping delays. Sourcing teams and plant operations had raw transaction records, but lacked clear, consolidated visibility into late delivery trends. To identify systemic supply chain bottlenecks, we analyzed a dataset comprising <strong>180,519 total orders</strong> with <strong>53 data columns</strong> spanning the years <strong>2015 to 2018</strong>, covering <strong>50 distinct product categories</strong>.</p><div class='case-results-stats' style='margin: 20px 0;'><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>180,519</span><span class='stat-lbl'>Total Orders</span></div><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>53</span><span class='stat-lbl'>Data Columns</span></div><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>2015–2018</span><span class='stat-lbl'>Time Period</span></div><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>50</span><span class='stat-lbl'>Categories</span></div></div>",
            problem: "<h3>Problem</h3><p>Systemic late deliveries were causing high customer churn, but it was unclear if these failures were due to seasonal fluctuations, localized geographic factors, carrier constraints, or specific product lines. Furthermore, thin profit margins were suspected of being eroded by shipping SLA penalties and high last-mile carrier costs, particularly in premium shipment categories.</p>",
            approach: "<h3>Approach</h3><p>We structured a multi-dimensional performance dashboard in Microsoft Excel using advanced Pivot Tables, dynamic data validation, and descriptive statistics. We mapped fulfillment rates by geography (all 23 regions), evaluated shipping classes (First Class, Second Class, Same Day, Standard), tracked sales revenue against total profit across top countries, and audited category margins across all 50 product segments.</p>",
            execution: "<h3>Execution</h3><p>Our operational audit of the transaction data revealed several key patterns:</p><ul class='timeline-bullets' style='margin-left: 20px; color: var(--secondary-color); font-size: 15px; line-height: 1.6;'><li style='margin-bottom: 8px;'><strong>Systemic, Non-Seasonal Issue:</strong> Charting the monthly sales trend revealed that the late delivery rate was remarkably stable between <strong>53% and 57%</strong> every single month for 3 years, proving that delays were structural rather than seasonal.</li><li style='margin-bottom: 8px;'><strong>Fulfillment Failures in Premium Tier:</strong> Segmenting delays by shipping class revealed that <strong>First Class shipping</strong> (the highest premium tier) was the worst performer, suffering a staggering <strong>95.32% late rate</strong>.</li><li style='margin-bottom: 8px;'><strong>High Profit Vulnerability:</strong> Auditing top product categories (e.g. Fishing, Cleats, Camping & Hiking) and geographic sales (Estados Unidos, Francia, México) showed that while sales volumes were high, average profit margins were constrained to <strong>10.78%</strong>, making the business highly sensitive to SLA refund liabilities.</li><li style='margin-bottom: 8px;'><strong>Regional Discrepancies:</strong> Transit times fluctuated heavily across destinations, with regions like Central Africa exhibiting late rates as high as <strong>57.96%</strong>.</li></ul>",
            results: "<h3>Results & Recommendations</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num' style='color: #d9383a;'>54.83%</span><span class='stat-lbl'>Late Delivery Rate</span></div><div class='stat-box'><span class='stat-num' style='color: #e67e22;'>95.32%</span><span class='stat-lbl'>First Class Late Rate</span></div><div class='stat-box'><span class='stat-num'>10.78%</span><span class='stat-lbl'>Avg Profit Margin</span></div></div><p>The overall audit confirmed <strong>98,977 late deliveries (54.83% of total)</strong>, compared to 23.04% advance shipping, 17.84% on-time shipping, and 4.30% cancellations. We presented a carrier-restructuring proposal to target the First Class logistics segment and proposed regional fulfillment hub relocations in areas with >55% delays to safeguard the 10.78% profit margins from transit leakages.</p>"
        },
        {
            title: "GIS-Optimized Last-Mile Locker Network Design",
            eyebrow: "Case Study 2 • Operations Research",
            summary: "Developing a GIS-driven bi-level multi-objective optimization model, bipartite network analysis, and SimPy simulation for parcel locker placement in Bangalore.",
            method: "Bi-Level MILP & Bipartite Network Analysis",
            tools: "Python (PuLP, SimPy, NetworkX) / QGIS / Geopandas",
            timeline: "B.Tech Graduation Project (May 2026)",
            context: "<h3>Context</h3><p>Last-mile delivery is the most cost-intensive segment of e-commerce logistics, representing up to 53% of total costs. Self-service parcel lockers offer a sustainable alternative by consolidating shipments. This project designs an optimal parcel locker network for Indiranagar, Bangalore, a 3 km × 3 km study area divided into 621 demand grid cells with 20 candidate locker sites.</p>",
            problem: "<h3>Problem</h3><p>Standard locker network layouts ignore customer convenience and network resilience, leading to low adoption rates. Furthermore, static planning models rely on arbitrary slot turnover assumptions (such as r = 3) which fail to match dynamic daily occupancy behaviors and peak hours saturation.</p>",
            approach: "<h3>Approach</h3><p>We formulated the problem as a bi-level Stackelberg game: the upper-level model minimizes installation and operating costs, while the lower-level model maximizes customer utility (based on proximity, safety, transit access, and flexibility). We applied a hard 500m walking constraint, evaluated network resilience using bipartite graphs, and validated turnover assumptions using SimPy discrete-event simulation.</p>",
            execution: "<h3>Execution</h3><p>We modeled and solved the bi-level MILP by reformulating it into a single-level program using KKT conditions, solved via Python PuLP (with CBC). We executed a bipartite graph network analysis in NetworkX to compute Dual Centrality (DC) and Coverage Centrality (CC), and simulated worst-case sequential locker disruptions. Lastly, we built a 50-replication SimPy discrete-event simulation modeling lockers as capacity-constrained containers, analyzing customer pickup rates under Poisson arrivals and 8-hour mean dwell times.</p>",
            results: "<h3>Results</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num'>825t</span><span class='stat-lbl'>CO₂ Saved / Yr</span></div><div class='stat-box'><span class='stat-num'>85.3%</span><span class='stat-lbl'>First-Attempt Success</span></div></div><p>The SimPy simulation rejected the turnover assumption of r = 3, finding a true turnover of r_eff = 1.75. Re-running the MILP with r = 1.75 recommended opening all 20 candidate sites at Large capacity. At 10% adoption, this configuration achieves 48.9% demand coverage, 80.2% top-2 preference satisfaction, and saves 825 tonnes of CO₂ annually (removing 177 cars from roads).</p>"
        },
        {
            title: "Warehouse Simulation & Realism Enhancement",
            eyebrow: "Case Study 3 • Systems Engineering",
            summary: "Developing randomized preloaded inventory models and automated Excel data pipelines in AnyLogic PLE to simulate real-world warehouse operations.",
            method: "AnyLogic Simulation Modeling",
            tools: "AnyLogic PLE / MS Excel / Connectivity Palette",
            timeline: "Academic Internship (CoELSCM)",
            context: "<h3>Context</h3><p>In industry, simulation modeling is key to testing warehouse configurations risk-free. However, standard default templates in modeling tools like AnyLogic often start in an empty state and yield identical results across runs, failing to capture the standing stock and randomness of real-world logistics.</p>",
            problem: "<h3>Problem</h3><p>The original warehouse model began with zero inventory on hand (an empty state starting condition), which is unrealistic for active facilities. Additionally, the simulation was deterministic. Pallet arrival intervals were static and slotting policies followed a fixed sequence, producing repetitive output data that didn't reflect natural variability.</p>",
            approach: "<h3>Approach</h3><p>My objectives were to preload the warehouse shelves with standard standing inventory (beginning with 10% capacity), introduce run-to-run randomization on pallet arrival slots to capture natural operational noise, and automate performance reporting to an Excel file.</p>",
            execution: "<h3>Execution</h3><p>I utilized the built-in 'Initial stocks' settings in AnyLogic to pre-fill 10% of the storage shelves with pallets at model startup, applying a randomized slotting policy. To ensure run-to-run variance, I configured a unique random seed for each simulation experiment. Finally, I linked an Excel agent from the Connectivity palette to the model UI, enabling a single click on a button to call <code>Output.writeDataSet()</code> and export <code>pickTimeData</code> logs dynamically.</p>",
            results: "<h3>Results</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num'>10%</span><span class='stat-lbl'>Preloaded Shelves</span></div><div class='stat-box'><span class='stat-num'>100%</span><span class='stat-lbl'>Randomized Outputs</span></div></div><p>The updated simulation successfully starts with 10% standing inventory distributed non-deterministically. Running the model with randomized seeds generates unique picking duration logs every run, which are exported instantly to Excel for further processing and statistical analysis.</p>"
        },
        {
            title: "Cost Optimization & Vendor Strategy: NIT Calicut Mess",
            eyebrow: "Case Study 4 • Cost Optimization",
            summary: "Spend analysis and vendor prioritization framework designed across a Rs. 8.49L monthly budget and 81 product categories.",
            method: "ABC-Pareto Analytics",
            tools: "MS Excel / Spend Dashboards",
            timeline: "4 Weeks",
            context: "<h3>Context</h3><p>Managing raw materials procurement and logistics for student dining facilities at NIT Calicut requires structured spend visibility. To identify key spending drivers and prioritize sourcing management, we analyzed a purchasing ledger comprising a <strong>Rs. 8.49L monthly budget</strong> across <strong>81 distinct product categories</strong>.</p>",
            problem: "<h3>Problem</h3><p>Fragmented vendor purchasing led to pricing variations and administrative inefficiencies. Sourcing coordinators lacked quantitative priority guidelines to determine which categories drove the bulk of expenses and where negotiation efforts would yield the highest cost benefits.</p>",
            approach: "<h3>Approach</h3><p>We structured a spend analysis mapping procurement data across the Rs. 8.49L monthly budget. Using the ABC-Pareto prioritization methodology, we sorted the 81 product categories to identify top cost drivers and develop a strategic vendor prioritization framework.</p>",
            execution: "<h3>Execution</h3><p>We designed negotiation levers including bulk ordering thresholds and vendor consolidation strategies to streamline contract terms and reduce purchasing overhead.</p>",
            results: "<h3>Results & Deliverables</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num'>Rs. 8.49L</span><span class='stat-lbl'>Monthly Budget</span></div><div class='stat-box'><span class='stat-num'>81</span><span class='stat-lbl'>Categories Audited</span></div><div class='stat-box'><span class='stat-num'>ABC-Pareto</span><span class='stat-lbl'>Prioritization</span></div></div><p>Built a Microsoft Excel spend dashboard enabling ongoing cost tracking and strategic decision making for institutional dining procurement.</p>"
        }
    ];

    const projectCards = document.querySelectorAll('.project-card');
    const caseDrawer = document.getElementById('case-study-drawer');
    const closeCaseDrawer = document.getElementById('close-case-drawer');
    const caseOverlay = document.getElementById('case-drawer-overlay');

    const drawerEyebrow = document.getElementById('case-detail-eyebrow');
    const drawerTitle = document.getElementById('case-detail-title');
    const drawerSummary = document.getElementById('case-detail-summary');
    const drawerMethod = document.getElementById('case-detail-method');
    const drawerTools = document.getElementById('case-detail-tools');
    const drawerTimeline = document.getElementById('case-detail-timeline');

    const tabButtons = document.querySelectorAll('.case-tab-btn');
    const tabPanes = {
        context: document.getElementById('pane-context'),
        problem: document.getElementById('pane-problem'),
        approach: document.getElementById('pane-approach'),
        execution: document.getElementById('pane-execution'),
        results: document.getElementById('pane-results')
    };

    let activeCase = null;

    if (projectCards.length && caseDrawer) {
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-project-idx'));
                const cs = caseStudiesData[idx];
                if (cs) {
                    activeCase = cs;
                    // Populate basic elements
                    drawerEyebrow.textContent = cs.eyebrow;
                    drawerTitle.textContent = cs.title;
                    drawerSummary.textContent = cs.summary;
                    drawerMethod.textContent = cs.method;
                    drawerTools.textContent = cs.tools;
                    drawerTimeline.textContent = cs.timeline;

                    // Populate tabs content
                    tabPanes.context.innerHTML = cs.context;
                    tabPanes.problem.innerHTML = cs.problem;
                    tabPanes.approach.innerHTML = cs.approach;
                    tabPanes.execution.innerHTML = cs.execution;
                    tabPanes.results.innerHTML = cs.results;

                    // Reset to first tab
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabButtons[0].classList.add('active');
                    Object.values(tabPanes).forEach(pane => pane.classList.remove('active'));
                    tabPanes.context.classList.add('active');

                    // Open drawer & lock background scrolling
                    caseDrawer.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close functions
        const closeDrawerFunc = () => {
            caseDrawer.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeCaseDrawer) closeCaseDrawer.addEventListener('click', closeDrawerFunc);
        if (caseOverlay) caseOverlay.addEventListener('click', closeDrawerFunc);

        // Close on bottom close button click
        const bottomCloseCaseDrawer = document.getElementById('bottom-close-case-drawer');
        if (bottomCloseCaseDrawer) bottomCloseCaseDrawer.addEventListener('click', closeDrawerFunc);

        // Close when scrolling outside (on the overlay)
        if (caseOverlay) {
            caseOverlay.addEventListener('wheel', closeDrawerFunc);
            caseOverlay.addEventListener('touchmove', closeDrawerFunc);
        }

        if (caseDrawer) {
            caseDrawer.addEventListener('click', (e) => {
                const content = caseDrawer.querySelector('.drawer-content');
                if (content && !content.contains(e.target)) {
                    closeDrawerFunc();
                }
            });
        }

        // Drawer Tabs click listeners
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const tabName = button.getAttribute('data-tab');
                Object.values(tabPanes).forEach(pane => pane.classList.remove('active'));
                if (tabPanes[tabName]) {
                    tabPanes[tabName].classList.add('active');
                }
            });
        });
    }


    /* ==========================================================================
       6. DYNAMIC FIELD NOTES DRAWER SYSTEM
       ========================================================================== */
    const notesData = [
        {
            title: "Shop Floor Realities: WMS & SKU Scaling",
            meta: "May 28, 2026 • Shop Floor Insights",
            body: `
                <p>During my internship at Micron Precision Screws, I witnessed the operational complexities of managing SKU sprawl on an active shop floor. The plant produces over 3,000 fastener variations (SKUs) across different grades, lengths, and head types. Tracking these components across three separate plants presents a massive logistics bottleneck.</p>
                
                <h2>The WMS Bottleneck</h2>
                <p>Without a structured Warehouse Management System (WMS), material staging zones quickly become congested. Operators frequently lose time searching for specific fastener batches, leading to production delays. Our implementation team focused on establishing strict pick-list routing rules and auditing stock coordinates to synchronize physical inventory with the software system.</p>
                
                <blockquote>
                    "Efficiency on the shop floor is not just about machine speed; it's about the precision of material visibility."
                </blockquote>
                
                <h2>Key Operations Takeaways</h2>
                <p>By defining clear staging coordinates and structuring visual flags, we improved material flow, reduced container handling operations, and laid down standard guidelines to ensure high picking velocity as the factory scales production.</p>
            `
        },
        {
            title: "Warehouse Simulation: Preloaded Inventory & Randomization",
            meta: "Apr 12, 2025 • Simulation Modeling",
            body: `
                <p>Before executing physical warehouse operations, testing in a risk-free environment is critical. At the Centre of Excellence (CoELSCM), my research focused on enhancing the realism of default AnyLogic warehouse models by incorporating preloaded standing stock and run-to-run randomization.</p>
                
                <h2>Preloading Standing Inventory</h2>
                <p>Typical default templates in simulation software start with a completely empty warehouse, which fails to reflect active operations. By configuring the 'Initial stocks' settings, I initialized the simulation with 10% of the warehouse shelves pre-filled with pallets distributed non-deterministically.</p>
                
                <blockquote>
                    "In logistics, a simulation must start with active standing inventory to accurately mirror real-world dynamics."
                </blockquote>
                
                <h2>Data Export Automation</h2>
                <p>To analyze performance, I established an automated data pipeline linking an Excel agent from the Connectivity palette to the AnyLogic run model. Using custom Java scripts like <code>Output.writeDataSet()</code>, I enabled one-click exporting of picking durations (<code>pickTimeData</code>) to streamline further statistical evaluations.</p>
            `
        },
        {
            title: "Applying Systems Thinking to Dining Sourcing",
            meta: "Mar 05, 2025 • Procurement Logistics",
            body: `
                <p>Logistics and spend control principles apply just as strongly to institutional services as they do to corporate supply chains. In this project, I audited the sourcing ledger of the NIT Calicut student dining messes to optimize procurement operations.</p>
                
                <h2>ABC-Pareto Spend Categorization</h2>
                <p>Analyzing a monthly budget of ₹8.49L, we categorized expenses across 81 supply lines. The Pareto analysis revealed that just 12 category items (like milk, rice, and cooking oil) accounted for over 78% of the total monthly spend. These were classified as 'Category A' items requiring strict cost controls.</p>
                
                <blockquote>
                    "In procurement, focus on the vital few rather than the trivial many."
                </blockquote>
                
                <h2>Negotiation & Consolidation Levers</h2>
                <p>By identifying category spends, we proposed vendor contract consolidation guidelines. Consolidating sourcing from multiple suppliers under bulk-pricing frameworks provided substantial negotiation leverage, paving the way to stabilize mess margins.</p>
            `
        },
        {
            title: "GIS-Optimized Last-Mile Parcel Locker Networks",
            meta: "Feb 18, 2026 • Last-Mile SCM",
            body: `
                <p>Last-mile logistics represents the most expensive and carbon-intensive segment of e-commerce, contributing up to 53% of total costs. For my B.Tech capstone project, I worked on the strategic placement and capacity planning of a parcel locker network in Indiranagar, Bangalore, using a bi-level multi-objective optimization framework.</p>
                
                <h2>Bipartite Network Resilience</h2>
                <p>By modeling the demand-grid locker relationship as a bipartite graph in NetworkX, we computed Dual Centrality (DC) and Coverage Centrality (CC) to analyze network robustness. We identified that L11 (Binnamangala) is the most critical site in the network with 24 exclusive grids relying solely on it, demonstrating a sharp centre-periphery resilience gradient.</p>
                
                <blockquote>
                    "Integrating network science and mathematical optimization bridges the gap between spatial accessibility and physical capacity constraints."
                </blockquote>
                
                <h2>Discrete-Event Simulation Validation</h2>
                <p>We coded a 50-replication discrete-event simulation in SimPy to model dynamic daily occupancy. The simulation rejected the initial turnover assumption of r = 3 (finding reff = 1.75), which prompted a MILP re-run. The corrected model showed that a 20-site Large-locker network achieves 48.9% demand coverage at 10% adoption and saves 825 tonnes of CO₂ annually.</p>
            `
        }
    ];

    const noteCards = document.querySelectorAll('.note-card');
    const noteDrawer = document.getElementById('note-drawer');
    const closeNoteDrawer = document.getElementById('close-note-drawer');
    const noteOverlay = document.getElementById('note-drawer-overlay');
    
    const noteDetailMeta = document.getElementById('note-detail-meta');
    const noteDetailTitle = document.getElementById('note-detail-title');
    const noteDetailBody = document.getElementById('note-detail-body');

    if (noteCards.length && noteDrawer) {
        noteCards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-note-idx'));
                const note = notesData[idx];
                if (note) {
                    noteDetailMeta.textContent = note.meta;
                    noteDetailTitle.textContent = note.title;
                    noteDetailBody.innerHTML = note.body;

                    noteDrawer.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeNoteFunc = () => {
            noteDrawer.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeNoteDrawer) closeNoteDrawer.addEventListener('click', closeNoteFunc);
        if (noteOverlay) noteOverlay.addEventListener('click', closeNoteFunc);

        // Close on bottom close button click
        const bottomCloseNoteDrawer = document.getElementById('bottom-close-note-drawer');
        if (bottomCloseNoteDrawer) bottomCloseNoteDrawer.addEventListener('click', closeNoteFunc);

        // Close when scrolling outside (on the overlay)
        if (noteOverlay) {
            noteOverlay.addEventListener('wheel', closeNoteFunc);
            noteOverlay.addEventListener('touchmove', closeNoteFunc);
        }

        if (noteDrawer) {
            noteDrawer.addEventListener('click', (e) => {
                const content = noteDrawer.querySelector('.drawer-content');
                if (content && !content.contains(e.target)) {
                    closeNoteFunc();
                }
            });
        }

        }


    /* ==========================================================================
       7. INTERACTIVE 3D MOUSE-TILT CARD ANIMATION
       ========================================================================== */
    const tiltElements = document.querySelectorAll('.project-card, .timeline-content, .photo-container');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const dx = x - xc;
            const dy = y - yc;
            
            // Limit tilt angle to a maximum of 4.5 degrees for premium micro-motion feel
            const rx = -(dy / yc) * 4.5;
            const ry = (dx / xc) * 4.5;
            
            el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015, 1.015, 1.015)`;
            el.style.boxShadow = '0 20px 40px rgba(13, 13, 13, 0.04)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            el.style.boxShadow = '';
            el.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none'; // remove delay during active tracking
        });
    });


    /* ==========================================================================
       8. CONTACT FORM SIMULATOR
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Transmitting Data...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.textContent = 'Transmission Complete';
                submitBtn.style.backgroundColor = '#4A6984';
                submitBtn.style.borderColor = '#4A6984';
                submitBtn.style.color = '#FAFAF8';
                submitBtn.style.opacity = '1';
                
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                }, 3000);
            }, 1200);
        });
    }

    // Global keydown escape listener to close any active modal drawer (using close button clicks for safe execution)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const caseStudyDrawer = document.getElementById('case-study-drawer');
            const noteDrawer = document.getElementById('note-drawer');
            
            if (caseStudyDrawer && caseStudyDrawer.classList.contains('active')) {
                const closeBtn = caseStudyDrawer.querySelector('.drawer-close-btn');
                if (closeBtn) closeBtn.click();
            }
            
            if (noteDrawer && noteDrawer.classList.contains('active')) {
                const closeBtn = noteDrawer.querySelector('.drawer-close-btn');
                if (closeBtn) closeBtn.click();
            }
        }
    });

});
