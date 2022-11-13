INSERT IGNORE INTO Users(first_name, last_name, email, password)
VALUES ('Hubert T.H', 'Chan', 'hubert@cs.hku.hk', ''),
    ('Tat Wing', 'Chim', 'twchim@cs.hku.hk', ''),
    ('Yi King', 'Choi', 'ykchoi@cs.hku.hk', ''),
    ('Luo', 'Ping', 'pluo@cs.hku.hk', '');
INSERT IGNORE INTO Teachers(`teacher_id`)
SELECT Users.user_id
FROM Users
    LEFT JOIN Students ON Users.user_id <> Students.user_id;
INSERT IGNORE INTO Classes(
        teacher_id,
        course_code,
        course_name,
        academic_year,
        `description`
    )
VALUES (
        4,
        'COMP3278',
        "Introduction to Database Management System",
        year(curdate()),
        "This course studies the principles, design, administration, and implementation of database management systems. Topics include: entity-relationship model, relational model, relational algebra, database design and normalization, database query languages, indexing schemes, integrity and concurrency control."
    ),
    (
        2,
        "COMP3330",
        "Interactive Mobile Application Design and Programming",
        year(curdate()),
        "This course introduces the techniques for developing interactive mobile applications on Android platform. Topics include user interface design, graphics, parallel computing, database, network, multimedia, sensors and location service. Trends and tools for developing applications on various mobile platforms are also discussed. Students participate in both individual assignments and group projects to practice ideation, reading, writing, coding and presentation skills. "
    ),
    (
        2,
        "COMP3397",
        "Software Development",
        year(curdate()),
        "This course introduces the techniques for developing interactive mobile applications on Android platform. Topics include user interface design, graphics, parallel computing, database, network, multimedia, sensors and location service. Trends and tools for developing applications on various mobile platforms are also discussed. Students participate in both individual assignments and group projects to practice ideation, reading, writing, coding and presentation skills."
    );
INSERT IGNORE INTO Class_Time(
        class_id,
        day_of_week,
        start_time,
        end_time
    )
VALUES (1, 0, '14:30:00', '15:20:00'),
    (1, 3, '13:30:00', '15:20:00'),
    (2, 1, '13:30:00', '15:20:00'),
    (2, 4, '13:30:00', '14:20:00'),
    (3, 1, '09:30:00', '10:20:00'),
    (3, 4, '09:30:00', '11:20:00');
-- Insert course information between 2022-9-1 and 2022-12-1
INSERT IGNORE INTO Information(`class_id`, `date`, `course_number`) WITH recursive Date_Ranges AS (
        select '2022-09-01' as Date
        union all
        select Date + interval 1 day
        from Date_Ranges
        where Date < '2022-12-01'
    )
SELECT *
FROM (
        SELECT class_id,
            Date as `date`,
            ROW_NUMBER() OVER(
                PARTITION BY class_id
                order by Date
            ) course_number
        FROM Date_Ranges,
            Class_Time
        WHERE weekday(DATE) = day_of_week
        ORDER BY class_id,
            DATE
    ) t;
UPDATE Information
SET venue = "Meng Wah Complex MWT2"
WHERE (course_number % 2) = 0;
UPDATE Information
SET venue = "Chong Yue Ming CYYP2"
WHERE (course_number % 2) > 0;
INSERT IGNORE INTO TeacherMessage(
        class_id,
        course_number,
        send_at,
        subject,
        content,
        from_id
    )
VALUES (
        1,
        FLOOR(1 + RAND() * 20),
        FROM_UNIXTIME(
            UNIX_TIMESTAMP('2022-09-01 14:53:27') + FLOOR(0 + (RAND() * 63072000))
        ),
        "Update Tutorial Schedule",
        "Bla Bla testing testing 124",
        4
    ),
    (
        1,
        FLOOR(1 + RAND() * 20),
        FROM_UNIXTIME(
            UNIX_TIMESTAMP('2022-09-01 14:53:27') + FLOOR(0 + (RAND() * 63072000))
        ),
        "Update Tutorial Schedule",
        "Bla Bla testing testing 124",
        4
    ),
    (
        1,
        FLOOR(1 + RAND() * 20),
        FROM_UNIXTIME(
            UNIX_TIMESTAMP('2022-09-01 14:53:27') + FLOOR(0 + (RAND() * 63072000))
        ),
        "Update Tutorial Schedule",
        "Bla Bla testing testing 124",
        4
    );
INSERT IGNORE INTO CourseMaterial(class_id, course_number, file_link, file_name)
SELECT class_id,
    course_number,
    "https://moodle.hku.hk/pluginfile.php/4050987/mod_resource/content/1/tutorial%202-0%20Project%20Introduction.pdf?forcedownload=1",
    "ProjectCodeIntroduction.pdf"
FROM Information
WHERE date <= now()
    AND (
        course_number = (FLOOR(RAND() *(course_number)) + 1)
    );
INSERT IGNORE INTO ZoomLink(class_id, course_number, link)
SELECT class_id,
    course_number,
    "https://hku.zoom.us/j/96226740999?pwd=ZER1UUdxSVVhQzNXbXFkUDd3WjRBdz09"
FROM Information
WHERE date <= now()
    AND (
        course_number = (FLOOR(RAND() *(course_number)) + 1)
    );