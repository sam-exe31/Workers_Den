package com.workersden.repository;

import com.workersden.entity.Workerprofile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerprofileRepository extends JpaRepository<Workerprofile, Long> {

    @Query("SELECT w FROM Workerprofile w WHERE w.user.email = :email")
    Optional<Workerprofile> findByUser_Email(@Param("email") String email);

    @Query("SELECT w FROM Workerprofile w WHERE w.user.user_id = :userId")
    Optional<Workerprofile> findByUser_Id(@Param("userId") Long userId);

    List<Workerprofile> findByLocalityAndIsAvailableTrue(String locality);
}

