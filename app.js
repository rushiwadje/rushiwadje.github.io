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

    // Continuous scroll listener for smooth active nav highlighting
    function updateActiveLink() {
        if (!sections || !sections.length) return;
        
        let activeSection = sections[0];
        let closestDist = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const dist = Math.abs(rect.top - 72);
            
            // Check if section is currently spanning across the active region (header threshold)
            if (rect.top <= 80 && rect.bottom > 80) {
                activeSection = section;
                closestDist = -Infinity; // Highest priority candidate
            } else if (rect.top > 80 && dist < closestDist) {
                // If section is below the header, find the closest one to it
                closestDist = dist;
                activeSection = section;
            }
        });

        if (activeSection) {
            const activeId = activeSection.getAttribute('id');
            if (activeId) {
                navLinks.forEach(link => {
                    const hrefAttr = link.getAttribute('href');
                    if (hrefAttr && hrefAttr.startsWith('#')) {
                        const href = hrefAttr.substring(1);
                        if (href === activeId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                });
            }
        }
    }

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink); // Run on complete page load
    updateActiveLink(); // Run initially to set active state




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
            desc: "Designing, tracking, and optimizing flow networks. Hands-on experience with inventory layout, pick routing, SKU analysis, and WMS software integration in active warehouses.",
            skills: [
                "WMS Integration",
                "Network Routing",
                "SKU Sizing & Audits"
            ]
        },
        ops: {
            title: "Operations & Process Design",
            desc: "Mapping operations from raw materials to final packaging. Practical experience in workflow drafting, transport operations, and warehouse simulation modeling using AnyLogic.",
            skills: [
                "Workflow Modeling",
                "Shop-Floor Transitions",
                "SOP Development"
            ]
        },
        analytics: {
            title: "Business & SCM Analytics",
            desc: "Using data to solve operational bottlenecks. Experience conducting procurement audits, tracking SLA compliance, and building dynamic Excel dashboards.",
            skills: [
                "Spend Auditing",
                "SLA Compliance Tracking",
                "Excel KPI Dashboards"
            ]
        },
        strategy: {
            title: "Sourcing & Strategy",
            desc: "Evaluating sourcing strategies and contracts. Designing negotiation frameworks, analyzing logistical networks, and evaluating vendor deals for cost efficiency.",
            skills: [
                "Vendor Management",
                "Cost-Benefit Analysis",
                "Geopolitical SCM Analysis"
            ]
        },
        leadership: {
            title: "Leadership & Coordination",
            desc: "Coordinating teams and budgets. Managed event finances exceeding ₹1,00,000 as Treasurer and secured corporate sponsorships of ₹2,00,000+.",
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
            eyebrow: "Case Study 1 • Logistics Audit",
            summary: "Analyzed over 180,000 transaction records in Excel to pinpoint late delivery patterns and protect product margins.",
            method: "Data Analytics & Reporting",
            tools: "Excel Pivot Tables / Data Validation",
            timeline: "3 Weeks",
            context: "<h3>Context</h3><p>DataCo Global, a logistics provider, was dealing with severe shipping delays that hurt customer satisfaction. While operations teams tracked shipments daily, they lacked consolidated data to find long-term trends. We analyzed a dataset of <strong>180,519 total orders</strong> with <strong>53 variables</strong> from <strong>2015 to 2018</strong>, covering <strong>50 product categories</strong>.</p><div class='case-results-stats' style='margin: 20px 0;'><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>180,519</span><span class='stat-lbl'>Total Orders</span></div><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>53</span><span class='stat-lbl'>Data Columns</span></div><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>2015–2018</span><span class='stat-lbl'>Time Period</span></div><div class='stat-box'><span class='stat-num' style='font-size: 22px;'>50</span><span class='stat-lbl'>Categories</span></div></div>",
            problem: "<h3>Problem</h3><p>Persistent late deliveries were driving up customer complaints, but it wasn't clear if the issues were seasonal, geographical, or specific to certain carrier classes. There were also concerns that late shipping penalties and high carrier fees were eroding overall profit margins.</p>",
            approach: "<h3>Approach</h3><p>I built an interactive dashboard in Excel using Pivot Tables, charts, and lookup formulas to organize the transactions. We mapped delivery performance across 23 regions, compared delays by shipping classes (Same Day, First Class, Second Class, Standard), and compared sales revenue against profit margins for top countries and product categories.</p>",
            execution: "<h3>Execution</h3><p>The audit revealed several clear bottlenecks:</p><ul class='timeline-bullets' style='margin-left: 20px; color: var(--secondary-color); font-size: 15px; line-height: 1.6;'><li style='margin-bottom: 8px;'><strong>Structural Delays:</strong> Monthly late delivery rates remained steady between <strong>53% and 57%</strong> all year round, indicating a systemic operations issue rather than temporary seasonal spikes.</li><li style='margin-bottom: 8px;'><strong>Premium Service Failures:</strong> Ironically, <strong>First Class shipping</strong> (the highest premium tier) performed worst, with a staggering <strong>95.32% late delivery rate</strong>.</li><li style='margin-bottom: 8px;'><strong>Margin Pressure:</strong> High sales categories had thin profit margins averaging just <strong>10.78%</strong>, making the business highly vulnerable to shipping refund claims and carrier cost overrides.</li><li style='margin-bottom: 8px;'><strong>Regional Discrepancies:</strong> Performance varied widely, with Central Africa seeing late rates reach <strong>57.96%</strong>.</li></ul>",
            results: "<h3>Results & Recommendations</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num' style='color: #d9383a;'>54.83%</span><span class='stat-lbl'>Overall Delay Rate</span></div><div class='stat-box'><span class='stat-num' style='color: #e67e22;'>95.32%</span><span class='stat-lbl'>First Class Delay Rate</span></div><div class='stat-box'><span class='stat-num'>10.78%</span><span class='stat-lbl'>Avg Profit Margin</span></div></div><p>We found that **98,977 shipments (54.83%)** arrived late. We presented a proposal to renegotiate First Class carrier contracts and recommended relocating regional inventory hubs closer to high-volume, high-delay zones to help safeguard margins.</p>"
        },
        {
            title: "GIS-Optimized Last-Mile Locker Network Design",
            eyebrow: "Case Study 2 • Network Optimization",
            summary: "Designed a parcel locker placement layout for Indiranagar, Bangalore, using mathematical optimization, network science, and SimPy simulation.",
            method: "Bi-Level MILP & Bipartite Network Analysis",
            tools: "Python (PuLP, SimPy, NetworkX) / QGIS / Geopandas",
            timeline: "B.Tech Project",
            context: "<h3>Context</h3><p>Last-mile delivery accounts for up to 53% of total logistics costs and contributes heavily to urban traffic. Self-service lockers help solve this by consolidating deliveries. This project optimized a network of 20 potential locker sites in Indiranagar, Bangalore, dividing the area into 621 demand grid cells.</p>",
            problem: "<h3>Problem</h3><p>Locker networks are often planned using static models that make unrealistic assumptions about customer behavior and slot turnover rates, leading to low adoption or overflow during peak hours. We needed a model that accounted for walking distances, user preferences, and dynamic daily usage.</p>",
            approach: "<h3>Approach</h3><p>We formulated the placement as a bi-level optimization problem. The upper level minimized operating and installation costs, while the lower level maximized customer utility (proximity, convenience, and safety). We restricted walking distance to 500m, evaluated network resilience using graph analysis, and modeled dynamic locker usage with SimPy discrete-event simulation.</p>",
            execution: "<h3>Execution</h3><p>We solved the MILP model using Python PuLP (CBC solver) by translating it into a single-level program. We built a bipartite graph in NetworkX to compute Coverage Centrality and evaluate how the network would handle locker outages. Finally, we simulated locker occupancy using a SimPy model, testing customer pickups under Poisson arrival rates and randomized dwell times.</p>",
            results: "<h3>Results</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num'>825t</span><span class='stat-lbl'>CO₂ Saved / Yr</span></div><div class='stat-box'><span class='stat-num'>85.3%</span><span class='stat-lbl'>First-Attempt Success</span></div></div><p>The simulation showed that a static assumption of 3 daily turnovers was unrealistic, finding an actual rate of 1.75. Adjusting our optimization model for this turnover recommended opening lockers at large capacity at all 20 candidate sites. At a 10% adoption rate, this layout covers 48.9% of demand and saves 825 tonnes of CO₂ annually.</p>"
        },
        {
            title: "Warehouse Simulation & Realism Enhancement",
            eyebrow: "Case Study 3 • Simulation Modeling",
            summary: "Built realistic warehouse models in AnyLogic, implementing preloaded inventory and randomized arrivals with Excel reporting pipelines.",
            method: "AnyLogic Simulation Modeling",
            tools: "AnyLogic PLE / MS Excel / Connectivity Palette",
            timeline: "Academic Internship (CoELSCM)",
            context: "<h3>Context</h3><p>Warehouse simulation helps test layout changes in a risk-free environment. However, default models in tools like AnyLogic often start completely empty and yield identical results across runs, failing to capture the standing stock and variability of real-world logistics.</p>",
            problem: "<h3>Problem</h3><p>A simulation starting with zero inventory doesn't reflect actual operations. We needed a model that starts with stock already on the shelves, includes random variation in pallet arrivals, and automatically exports statistics for analysis.</p>",
            approach: "<h3>Approach</h3><p>My goal was to preload the shelves to 10% capacity, introduce randomized seeds for pallet arrival rates, and build an automated export pipeline linking AnyLogic to Excel.</p>",
            execution: "<h3>Execution</h3><p>I wrote custom logic in AnyLogic to preload 10% of storage slots with inventory at startup, using a randomized layout. I configured unique random seeds for each run to capture operational noise. Finally, I linked an Excel agent from the Connectivity palette and wrote Java calls to export cycle time logs automatically when a run finishes.</p>",
            results: "<h3>Results</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num'>10%</span><span class='stat-lbl'>Preloaded Shelves</span></div><div class='stat-box'><span class='stat-num'>100%</span><span class='stat-lbl'>Randomized Runs</span></div></div><p>The updated simulation successfully starts with a realistic inventory baseline. Running the model generates unique cycle time distributions that are exported instantly to Excel for further statistics and analysis.</p>"
        },
        {
            title: "Cost Optimization & Vendor Strategy: NIT Calicut Mess",
            eyebrow: "Case Study 4 • Procurement Analysis",
            summary: "Conducted a spend audit on a Rs. 8.49L monthly student dining mess budget to identify cost drivers and vendor consolidation strategies.",
            method: "ABC-Pareto Analytics",
            tools: "MS Excel / Spend Dashboards",
            timeline: "4 Weeks",
            context: "<h3>Context</h3><p>Managing food sourcing for large student messes requires careful cost tracking. To identify where we could consolidate buying power and negotiate better pricing, we analyzed a purchasing ledger comprising a <strong>Rs. 8.49L monthly budget</strong> across <strong>81 product categories</strong>.</p>",
            problem: "<h3>Problem</h3><p>Fragmented buying across too many small suppliers led to varying prices and high administrative overhead. Mess coordinators lacked quantitative data to know which ingredients drove the bulk of expenses and where negotiation efforts would yield the highest return.</p>",
            approach: "<h3>Approach</h3><p>I structured a spend analysis using the ABC-Pareto methodology to rank categories by total expense. This helped isolate the few ingredients that made up the majority of the budget, setting a clear focus for cost negotiations.</p>",
            execution: "<h3>Execution</h3><p>I analyzed the invoice data in Excel, built category spend breakdowns, and mapped supplier distributions. We then proposed contract consolidation guidelines and bulk procurement thresholds for high-volume items.</p>",
            results: "<h3>Results & Deliverables</h3><div class='case-results-stats'><div class='stat-box'><span class='stat-num'>Rs. 8.49L</span><span class='stat-lbl'>Monthly Budget</span></div><div class='stat-box'><span class='stat-num'>81</span><span class='stat-lbl'>Categories Audited</span></div><div class='stat-box'><span class='stat-num'>ABC-Pareto</span><span class='stat-lbl'>Prioritization</span></div></div><p>The Pareto audit showed that just 12 category items (like milk, rice, and cooking oil) accounted for over 78% of the total monthly spend. We built a spend dashboard enabling ongoing cost tracking and suggested bulk-pricing contracts that stabilized mess margins.</p>"
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
       7. INTERACTIVE 3D MOUSE-TILT CARD ANIMATION
       ========================================================================== */
    const tiltElements = document.querySelectorAll('.project-card, .ai-card, .timeline-content, .photo-container');
    
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
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
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
            
            if (caseStudyDrawer && caseStudyDrawer.classList.contains('active')) {
                const closeBtn = caseStudyDrawer.querySelector('.drawer-close-btn');
                if (closeBtn) closeBtn.click();
            }
        }
    });

});
