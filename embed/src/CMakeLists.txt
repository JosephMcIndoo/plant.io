# This file was automatically generated for projects
# without default 'CMakeLists.txt' file.

FILE(GLOB_RECURSE app_sources ${CMAKE_SOURCE_DIR}/src/*.*)

idf_component_register(SRCS ${app_sources})

target_include_directories(${COMPONENT_LIB} PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/../lib
)
