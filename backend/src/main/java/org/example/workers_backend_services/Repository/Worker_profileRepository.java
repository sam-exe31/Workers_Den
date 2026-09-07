package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Worker_profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Worker_profileRepository extends JpaRepository<Worker_profile, Long> {

    @Query("SELECT w FROM Worker_profile w WHERE w.user.email = :email")
    Optional<Worker_profile> findByUser_Email(@Param("email") String email);

    @Query("SELECT w FROM Worker_profile w WHERE w.user.user_id = :userId")
    Optional<Worker_profile> findByUser_Id(@Param("userId") Long userId);

    List<Worker_profile> findByLocalityAndIsAvailableTrue(String locality);
}