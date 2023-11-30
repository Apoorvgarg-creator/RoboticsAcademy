"""
models.py
"""

import json
from django.db import models
import subprocess


StatusChoice = (
    ('ACTIVE', "ACTIVE"),
    ('INACTIVE', "INACTIVE"),
    ('PROTOTYPE', "PROTOTYPE")
)

VisualizationType = (
    ('none', "None"),
    ('console', "Console"),
    ('gazebo_gra', "Gazebo GRA"),
    ('gazebo_rae', "Gazebo RAE"),
    ('physic_gra', "Physic GRA"),
    ('physic_rae', "Physic RAE")
)

WorldType = (
    ('none', "None"),
    ('gazebo', "Gazebo"),
    ('drones', "Gazebo Drones"),
    ('physical', "Physical")
)

# Create your models here.


class Exercise(models.Model):
    """
    RoboticsCademy Exercise model
    """
    exercise_id = models.CharField(max_length=40, blank=False, unique=True)
    name = models.CharField(max_length=40, blank=False, unique=True)
    description = models.CharField(max_length=400, blank=False)
    tags = models.CharField(
        max_length=2000,
        default=json.dumps({'tags': ""})
    )
    status = models.CharField(
        max_length=20,
        choices=StatusChoice,
        default="ACTIVE"
    )
    world = models.CharField(
        max_length=20,
        choices=WorldType,
        default="none"
    )
    visualization = models.CharField(
        max_length=20,
        choices=VisualizationType,
        default="none"
    )
    launch_files = models.TextField(default=json.dumps({}))
    configuration = models.TextField(default=json.dumps({}))

    def __str__(self):
        return str(self.name)

    @property
    def context(self):
        """
        Build and return context
        """
        exercise_configuration = json.loads(self.configuration)
        launch_files_dict = json.loads(self.launch_files)
        output = subprocess.check_output(['bash', '-c', 'echo $ROS_VERSION'])
        output_str = output.decode('utf-8')
        if output_str.strip() == '1':
            ros_version = 'ROS1'
        else:
            ros_version = 'ROS2'
        configurations = []

        if len(launch_files_dict[ros_version]) == len(exercise_configuration[ros_version]):
            for i in range(len(launch_files_dict[ros_version])):
                launch_file = launch_files_dict[ros_version][i]
                application_config = exercise_configuration[ros_version][i]

                config = {
                    "application": application_config["application"],
                    "exercise_id": str(self.exercise_id),
                    "visualization": self.visualization,
                    "world": self.world,
                    "launch_file_path": launch_file["path"],
                    "name": launch_file["name"]
                }
                configurations.append(config)

            context = {'exercise_base': "exercise_base_2_RA.html",
                       'exercise_id': self.exercise_id,
                       'exercise_config': configurations,
                       }
        return context
