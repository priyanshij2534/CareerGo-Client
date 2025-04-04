import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaFilter, FaDownload, FaEnvelope, FaPhone, FaGlobe, FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaAward } from 'react-icons/fa'
import { IoMdTime } from 'react-icons/io'
import { MdOutlineCastForEducation, MdOutlineAttachMoney, MdCloudUpload } from 'react-icons/md'
import { BsBook, BsCalendarCheck, BsExclamationTriangle } from 'react-icons/bs'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import {
    createCourseCategory,
    getCourseCategory,
    deleteCourseCategory,
    createCourse,
    getAllCourse,
    getCourseDetails,
    updateCourseDetails,
    deteleCourse,
} from '../../store/slices/institutionSlice'

const initialCourseData = []

const CoursesOffered = () => {
    const dispatch = useDispatch()
    const [courseData] = useState(initialCourseData)
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredCourses, setFilteredCourses] = useState(courseData)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [formMode, setFormMode] = useState('add')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)
    const [activeFilters, setActiveFilters] = useState([])
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [categoryError, setCategoryError] = useState(null)

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: '',
        type: 'college',
        duration: '',
        eligibility: '',
        mode: 'Offline',
        fees: '',
        syllabus: [''],
        admissionProcess: '',
        contactInfo: {
            email: '',
            phone: '',
            website: '',
        },
        brochureUrl: '',
        brochureFile: null,
    })

    const fileInputRef = useRef(null)

    const { institutionId } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchCourseCategories = async () => {
            setCategoryError(null)

            const response = await dispatch(getCourseCategory({ institutionId })).unwrap()

            if (response.success && response.data.courseCategory) {
                const fetchedCategories = response.data.courseCategory.courseCategory || []
                setCategories(fetchedCategories)
            }
        }

        fetchCourseCategories()
    }, [dispatch, institutionId])

    useEffect(() => {
        const fetchCourses = async () => {
            const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : ''
            const searchParam = searchTerm || ''

            const response = await dispatch(
                getAllCourse({
                    institutionId,
                    category: categoryParam,
                    search: searchParam,
                })
            ).unwrap()

            if (response.success && response.data.courses) {
                setFilteredCourses(response.data.courses)
            }
        }

        fetchCourses()
    }, [dispatch, institutionId, selectedCategories, searchTerm])

    useEffect(() => {
        let result = courseData
        const activeFiltersList = []

        if (selectedCategories.length > 0) {
            result = result.filter((course) => selectedCategories.includes(course.category))
            activeFiltersList.push(`Categories: ${selectedCategories.join(', ')}`)
        }

        if (searchTerm) {
            result = result.filter(
                (course) =>
                    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            activeFiltersList.push(`Search: "${searchTerm}"`)
        }

        setFilteredCourses(result)
        setActiveFilters(activeFiltersList)
    }, [selectedCategories, searchTerm, courseData])

    const handleCourseSelect = async (course) => {
        const response = await dispatch(
            getCourseDetails({
                institutionId,
                courseId: course._id,
            })
        ).unwrap()

        if (response.success && response.data.course) {
            setSelectedCourse(response.data.course)
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name.startsWith('contactInfo.')) {
            const field = name.split('.')[1]
            setFormData({
                ...formData,
                contactInfo: {
                    ...formData.contactInfo,
                    [field]: value,
                },
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

    const handleSyllabusChange = (index, value) => {
        const updatedSyllabus = [...formData.syllabus]
        updatedSyllabus[index] = value
        setFormData({
            ...formData,
            syllabus: updatedSyllabus,
        })
    }

    const addSyllabusItem = () => {
        setFormData({
            ...formData,
            syllabus: [...formData.syllabus, ''],
        })
    }

    const removeSyllabusItem = (index) => {
        const updatedSyllabus = [...formData.syllabus]
        updatedSyllabus.splice(index, 1)
        setFormData({
            ...formData,
            syllabus: updatedSyllabus,
        })
    }

    const handleBrochureUpload = (e) => {
        const file = e.target.files[0]
        if (file && file.type === 'application/pdf') {
            const fileUrl = URL.createObjectURL(file)

            setFormData({
                ...formData,
                brochureUrl: fileUrl,
                brochureFile: file,
            })
        }
    }

    const handleAddCourse = () => {
        setFormData({
            name: '',
            category: '',
            type: 'college',
            duration: '',
            eligibility: '',
            mode: 'Online',
            fees: '',
            syllabus: [''],
            admissionProcess: '',
            contactInfo: {
                email: '',
                phone: '',
                website: '',
            },
            brochureUrl: '',
            brochureFile: null,
        })
        setFormMode('add')
        setShowForm(true)
    }

    const handleEditCourse = async (course) => {
        const response = await dispatch(
            getCourseDetails({
                institutionId,
                courseId: course._id,
            })
        ).unwrap()

        if (response.success && response.data.course) {
            const fullCourseDetails = response.data.course

            setFormData({
                _id: fullCourseDetails._id,
                name: fullCourseDetails.courseName,
                category: fullCourseDetails.category,
                type: 'college',
                duration: fullCourseDetails.duration.toString(),
                eligibility: fullCourseDetails.eligibility,
                mode: fullCourseDetails.mode,
                fees: fullCourseDetails.fees ? `₹${fullCourseDetails.fees}` : '',
                syllabus: fullCourseDetails.syllabus || [''],
                admissionProcess: fullCourseDetails.admissionProcess || '',
                contactInfo: {
                    email: fullCourseDetails.email || '',
                    phone: fullCourseDetails.phone || '',
                    website: fullCourseDetails.website || '',
                },
                brochureUrl: fullCourseDetails.brochure || '',
                brochureFile: null,
            })
            setFormMode('edit')
            setShowForm(true)
            setShowModal(false)
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        const coursePayload = {
            courseName: formData.name,
            category: formData.category,
            duration: Number.parseInt(formData.duration, 10),
            eligibility: formData.eligibility,
            mode: formData.mode,
            fees: Number.parseFloat(formData.fees.replace(/[₹,]/g, '')),
            syllabus: formData.syllabus,
            admissionProcess: formData.admissionProcess,
            email: formData.contactInfo.email,
            phone: formData.contactInfo.phone,
            website: formData.contactInfo.website,
            brochure: formData.brochureUrl,
        }

        if (formMode === 'add') {
            await dispatch(
                createCourse({
                    institutionId,
                    Payload: coursePayload,
                })
            ).unwrap()
        } else {
            await dispatch(
                updateCourseDetails({
                    institutionId,
                    courseId: formData._id,
                    Payload: coursePayload,
                })
            ).unwrap()
        }

        const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : ''
        const searchParam = searchTerm || ''

        const response = await dispatch(
            getAllCourse({
                institutionId,
                category: categoryParam,
                search: searchParam,
            })
        ).unwrap()

        if (response.success && response.data.courses) {
            setFilteredCourses(response.data.courses)
        }

        setShowForm(false)
    }

    const handleDeleteConfirm = (course) => {
        setCourseToDelete(course)
        setShowDeleteConfirm(true)
        setShowModal(false)
    }

    const handleDeleteCourse = async () => {
        await dispatch(
            deteleCourse({
                institutionId,
                courseId: courseToDelete._id,
            })
        ).unwrap()

        const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : ''
        const searchParam = searchTerm || ''

        const response = await dispatch(
            getAllCourse({
                institutionId,
                category: categoryParam,
                search: searchParam,
            })
        ).unwrap()

        if (response.success && response.data.courses) {
            setFilteredCourses(response.data.courses)
        }

        setShowDeleteConfirm(false)
        setCourseToDelete(null)
    }

    const resetFilters = () => {
        setSelectedCategories([])
        setSearchTerm('')
    }

    const handleAddCategory = () => {
        setShowCategoryForm(true)
    }

    const handleCategoryFormSubmit = async (e) => {
        e.preventDefault()

        if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
            setCategoryError(null)

            const payload = {
                courseCategory: newCategoryName.trim(),
            }

            await dispatch(
                createCourseCategory({
                    institutionId,
                    Payload: payload,
                })
            ).unwrap()

            const response = await dispatch(getCourseCategory({ institutionId })).unwrap()

            if (response.success && response.data.courseCategory) {
                const fetchedCategories = response.data.courseCategory.courseCategory || []
                setCategories(fetchedCategories)
            }

            setShowCategoryForm(false)
            setNewCategoryName('')
        }
    }

    const toggleCategorySelection = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category)
        setShowDeleteCategoryConfirm(true)
    }

    const confirmDeleteCategory = async () => {
        setCategoryError(null)

        await dispatch(
            deleteCourseCategory({
                institutionId,
                categoryName: categoryToDelete,
            })
        ).unwrap()

        const response = await dispatch(getCourseCategory({ institutionId })).unwrap()

        if (response.success && response.data.courseCategory) {
            const fetchedCategories = response.data.courseCategory.courseCategory || []
            setCategories(fetchedCategories)

            if (selectedCategories.includes(categoryToDelete)) {
                setSelectedCategories(selectedCategories.filter((cat) => cat !== categoryToDelete))
            }
        }

        setShowDeleteCategoryConfirm(false)
        setCategoryToDelete(null)
    }

    return (
        <div className="bg-background-white min-h-screen p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-navy-blue">Courses Offered</h1>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-heading font-semibold text-deep-blue flex items-center">
                        <HiOutlineAcademicCap className="mr-2" /> Course Categories
                    </h2>
                    <button
                        className="bg-deep-blue text-white px-4 py-2 rounded-md hover:bg-navy-blue transition-colors flex items-center"
                        onClick={handleAddCategory}>
                        <FaPlus className="mr-2" /> Add new category
                    </button>
                </div>

                {categoryError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{categoryError}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-4 border border-border-light">
                    {categories.length > 0 ? (
                        <ul className="space-y-2">
                            {categories.map((category, index) => (
                                <li
                                    key={index}
                                    className="rounded">
                                    <div className="flex items-center justify-between">
                                        <button
                                            className={`flex-1 p-2 rounded transition-colors flex items-center justify-between text-left cursor-pointer ${
                                                selectedCategories.includes(category) ? 'bg-navy-blue text-white' : 'hover:bg-background-light'
                                            }`}
                                            onClick={() => toggleCategorySelection(category)}>
                                            <div className="flex items-center">
                                                <div className="w-1 h-6 bg-gold mr-2"></div>
                                                {category}
                                            </div>
                                            {selectedCategories.includes(category) && <FaCheck className="text-gold" />}
                                        </button>
                                        <button
                                            className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                            onClick={() => handleDeleteCategory(category)}
                                            title="Delete Category">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-dark-gray py-4">No categories available. Add a new category to get started.</p>
                    )}
                </div>
            </div>

            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-heading font-semibold text-deep-blue flex items-center">
                        <BsBook className="mr-2" /> Detailed Course List
                    </h2>

                    <button
                        className="md:hidden flex items-center bg-navy-blue text-white px-4 py-2 rounded-md"
                        onClick={toggleFilters}>
                        <FaFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    <div className={`w-full md:w-auto flex flex-col md:flex-row gap-3 ${showFilters ? 'block' : 'hidden md:flex'}`}>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button
                            className="bg-deep-blue text-white px-4 py-2 rounded-md hover:bg-navy-blue transition-colors"
                            onClick={resetFilters}>
                            Reset Filters
                        </button>

                        <button
                            className="bg-deep-blue text-white px-4 py-2 rounded-md hover:bg-navy-blue transition-colors flex items-center"
                            onClick={handleAddCourse}>
                            <FaPlus className="mr-2" /> Add Course
                        </button>
                    </div>
                </div>

                {activeFilters.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {activeFilters.map((filter, index) => (
                            <div
                                key={index}
                                className="bg-navy-blue text-white px-3 py-1 rounded-full text-sm flex items-center">
                                {filter}
                                <button
                                    className="ml-2 hover:text-gold"
                                    onClick={resetFilters}>
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-border-light hover:shadow-lg transition-shadow">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-heading font-semibold text-navy-blue">{course.courseName}</h3>
                                    </div>

                                    <p className="text-sm text-dark-gray mb-3">{course.category}</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <IoMdTime className="mr-2 text-deep-blue" />
                                            <span>Duration: {course.duration} months</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FaAward className="mr-2 text-deep-blue" />
                                            <span>Eligibility: {course.eligibility}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <MdOutlineCastForEducation className="mr-2 text-deep-blue" />
                                            <span>Mode: {course.mode}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 bg-navy-blue text-white py-2 rounded-md hover:bg-deep-blue transition-colors"
                                            onClick={() => handleCourseSelect(course)}>
                                            View Details
                                        </button>
                                        <button
                                            className="bg-deep-blue text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
                                            onClick={() => handleEditCourse(course)}>
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="bg-red-600 text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
                                            onClick={() => handleDeleteConfirm(course)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-background-light p-6 rounded-lg text-center">
                        <p className="text-lg text-dark-gray">No courses found matching your criteria. Please adjust your filters.</p>
                    </div>
                )}
            </div>

            {showModal && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-navy-blue text-white p-4 flex justify-between items-center">
                            <h3 className="text-xl font-heading font-semibold">{selectedCourse.courseName}</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    className="text-white hover:text-gold transition-colors"
                                    onClick={() => handleEditCourse(selectedCourse)}
                                    title="Edit Course">
                                    <FaEdit />
                                </button>
                                <button
                                    className="text-white hover:text-red-400 transition-colors"
                                    onClick={() => handleDeleteConfirm(selectedCourse)}
                                    title="Delete Course">
                                    <FaTrash />
                                </button>
                                <button
                                    className="text-white hover:text-gold transition-colors"
                                    onClick={handleCloseModal}>
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="bg-background-light p-4 rounded-lg">
                                    <h4 className="font-heading font-semibold text-navy-blue mb-2 flex items-center">
                                        <IoMdTime className="mr-2" /> Duration
                                    </h4>
                                    <p>{selectedCourse.duration} months</p>
                                </div>

                                <div className="bg-background-light p-4 rounded-lg">
                                    <h4 className="font-heading font-semibold text-navy-blue mb-2 flex items-center">
                                        <FaAward className="mr-2" /> Eligibility
                                    </h4>
                                    <p>{selectedCourse.eligibility}</p>
                                </div>

                                <div className="bg-background-light p-4 rounded-lg">
                                    <h4 className="font-heading font-semibold text-navy-blue mb-2 flex items-center">
                                        <MdOutlineCastForEducation className="mr-2" /> Mode
                                    </h4>
                                    <p>{selectedCourse.mode}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-heading font-semibold text-navy-blue mb-3 flex items-center">
                                    <BsBook className="mr-2" /> Course Syllabus / Curriculum
                                </h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    {selectedCourse.syllabus && selectedCourse.syllabus.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-heading font-semibold text-navy-blue mb-3 flex items-center">
                                    <MdOutlineAttachMoney className="mr-2" /> Fee Structure
                                </h4>
                                <p>₹{selectedCourse.fees}</p>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-heading font-semibold text-navy-blue mb-3 flex items-center">
                                    <BsCalendarCheck className="mr-2" /> Admission Process
                                </h4>
                                <p>{selectedCourse.admissionProcess}</p>
                            </div>

                            <div className="bg-background-light p-4 rounded-lg mb-6">
                                <h4 className="font-heading font-semibold text-navy-blue mb-3">Contact Information</h4>
                                <div className="space-y-2">
                                    <p className="flex items-center">
                                        <FaEnvelope className="mr-2 text-deep-blue" />
                                        {selectedCourse.email}
                                    </p>
                                    <p className="flex items-center">
                                        <FaPhone className="mr-2 text-deep-blue" />
                                        {selectedCourse.phone}
                                    </p>
                                    <p className="flex items-center">
                                        <FaGlobe className="mr-2 text-deep-blue" />
                                        {selectedCourse.website}
                                    </p>
                                </div>
                            </div>

                            {selectedCourse.brochure && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={selectedCourse.brochure}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-deep-blue text-white py-3 rounded-md text-center hover:bg-navy-blue transition-colors flex items-center justify-center"
                                        download={`${selectedCourse.courseName.replace(/\s+/g, '-').toLowerCase()}-brochure.pdf`}>
                                        <FaDownload className="mr-2" /> Download Brochure
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-navy-blue text-white p-4 flex justify-between items-center">
                            <h3 className="text-xl font-heading font-semibold">{formMode === 'add' ? 'Add New Course' : 'Edit Course'}</h3>
                            <button
                                className="text-white hover:text-gold transition-colors"
                                onClick={() => setShowForm(false)}>
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleFormSubmit}
                            className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label
                                        htmlFor="courseName"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Course Name
                                    </label>
                                    <input
                                        id="courseName"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="courseCategory"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="courseCategory"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required>
                                        <option value="">Select Category</option>
                                        {categories.map((category, index) => (
                                            <option
                                                key={index}
                                                value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="courseDuration"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Duration
                                    </label>
                                    <input
                                        id="courseDuration"
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="courseEligibility"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Eligibility
                                    </label>
                                    <input
                                        id="courseEligibility"
                                        type="text"
                                        name="eligibility"
                                        value={formData.eligibility}
                                        onChange={handleInputChange}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="courseMode"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Mode
                                    </label>
                                    <select
                                        id="courseMode"
                                        name="mode"
                                        value={formData.mode}
                                        onChange={handleInputChange}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required>
                                        <option value="Offline">Offline</option>
                                        <option value="Online">Online</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="courseFees"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Fees
                                    </label>
                                    <input
                                        id="courseFees"
                                        type="text"
                                        name="fees"
                                        value={formData.fees}
                                        onChange={handleInputChange}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="syllabus"
                                    className="block text-navy-blue font-semibold mb-2">
                                    Syllabus / Curriculum
                                </label>
                                {formData.syllabus.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleSyllabusChange(index, e.target.value)}
                                            className="flex-1 border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="ml-2 bg-red-600 text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
                                            onClick={() => removeSyllabusItem(index)}
                                            disabled={formData.syllabus.length <= 1}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="mt-2 bg-deep-blue text-white px-4 py-2 rounded-md hover:bg-navy-blue transition-colors"
                                    onClick={addSyllabusItem}>
                                    Add Syllabus Item
                                </button>
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="admissionProcess"
                                    className="block text-navy-blue font-semibold mb-2">
                                    Admission Process
                                </label>
                                <input
                                    id="admissionProcess"
                                    type="text"
                                    name="admissionProcess"
                                    value={formData.admissionProcess}
                                    onChange={handleInputChange}
                                    className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <h4 className="text-navy-blue font-semibold mb-3">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label
                                            htmlFor="contactEmail"
                                            className="block text-navy-blue mb-2">
                                            Email
                                        </label>
                                        <input
                                            id="contactEmail"
                                            type="email"
                                            name="contactInfo.email"
                                            value={formData.contactInfo.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="contactPhone"
                                            className="block text-navy-blue mb-2">
                                            Phone
                                        </label>
                                        <input
                                            id="contactPhone"
                                            type="text"
                                            name="contactInfo.phone"
                                            value={formData.contactInfo.phone}
                                            onChange={handleInputChange}
                                            className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="courseWebsite"
                                            className="block text-navy-blue mb-2">
                                            Website
                                        </label>
                                        <input
                                            id="courseWebsite"
                                            type="text"
                                            name="contactInfo.website"
                                            value={formData.contactInfo.website}
                                            onChange={handleInputChange}
                                            className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="brochureUpload"
                                    className="block text-navy-blue font-semibold mb-2">
                                    Course Brochure (PDF)
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="brochureUpload"
                                        type="file"
                                        accept="application/pdf"
                                        ref={fileInputRef}
                                        onChange={handleBrochureUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="bg-deep-blue text-white px-4 py-2 rounded-md hover:bg-navy-blue transition-colors flex items-center">
                                        <MdCloudUpload className="mr-2" /> Upload Brochure
                                    </button>
                                    {formData.brochureFile && <span className="ml-3 text-green-600">{formData.brochureFile.name} uploaded</span>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="bg-light-gray text-dark-gray px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                    onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-deep-blue text-white px-6 py-2 rounded-md hover:bg-navy-blue transition-colors">
                                    {formMode === 'add' ? 'Add Course' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center text-red-600 mb-4">
                                <BsExclamationTriangle className="text-3xl mr-3" />
                                <h3 className="text-xl font-heading font-semibold">Confirm Deletion</h3>
                            </div>

                            <p className="mb-6">
                                Are you sure you want to delete <strong>{courseToDelete?.name}</strong>? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="bg-light-gray text-dark-gray px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                    onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                    onClick={handleDeleteCourse}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCategoryForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-heading font-semibold text-navy-blue mb-4">Add New Category</h3>

                            <form onSubmit={handleCategoryFormSubmit}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="newCategoryName"
                                        className="block text-navy-blue font-semibold mb-2">
                                        Category Name
                                    </label>
                                    <input
                                        id="newCategoryName"
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full border border-border-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deep-blue"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="bg-light-gray text-dark-gray px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                        onClick={() => setShowCategoryForm(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-deep-blue text-white px-6 py-2 rounded-md hover:bg-navy-blue transition-colors">
                                        Add Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteCategoryConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center text-red-600 mb-4">
                                <BsExclamationTriangle className="text-3xl mr-3" />
                                <h3 className="text-xl font-heading font-semibold">Confirm Category Deletion</h3>
                            </div>

                            <p className="mb-6">
                                Are you sure you want to delete the category <strong>{categoryToDelete}</strong>? This will remove all courses
                                associated with this category. This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="bg-light-gray text-dark-gray px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                    onClick={() => setShowDeleteCategoryConfirm(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                    onClick={confirmDeleteCategory}>
                                    Delete Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CoursesOffered
