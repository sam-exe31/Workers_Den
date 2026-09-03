package org.example.workers_backend_services.Service;

record ReviewState(double easeFactor, int interval, int repetitions) {}

static final int QUALITY_PASS_THRESHOLD = 5;
static final double MIN_EASE_FACTOR = 1.3;

ReviewState review(ReviewState current, int quality) {

    double newEF=
}