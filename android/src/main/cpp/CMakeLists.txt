# CMakeLists.txt
cmake_minimum_required(VERSION 3.13)
project(opusvedro_project LANGUAGES C CXX)

set(CMAKE_VERBOSE_MAKEFILE ON)

# Build the JNI shared library
add_library(opusvedro SHARED
  opusvedro.cpp
)

# Modern, scoped settings (react-native style)
target_compile_features(opusvedro PRIVATE cxx_std_17)
target_compile_options(opusvedro PRIVATE -fexceptions -frtti)
set_target_properties(opusvedro PROPERTIES POSITION_INDEPENDENT_CODE ON)

# Local includes
target_include_directories(opusvedro PRIVATE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

# Prebuilt Opus .so (per-ABI)
add_library(opus SHARED IMPORTED GLOBAL)
set_target_properties(opus PROPERTIES
  IMPORTED_LOCATION "${CMAKE_CURRENT_LIST_DIR}/lib/${ANDROID_ABI}/libopus.so"
)

# Android system log
find_library(log-lib log REQUIRED)

# Link everything
target_link_libraries(opusvedro PRIVATE
  opus
  ${log-lib}
)